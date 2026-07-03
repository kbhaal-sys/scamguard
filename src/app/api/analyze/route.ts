import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { buildUserPrompt, callLLM, parseAnalysis } from "@/lib/ai";
import { inspectUrl } from "@/lib/url-check";
import type { InputType } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TEXT = 12000;
const MAX_IMAGE_BYTES = 4.5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // ---- 1. Auth ----
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to run a scan." }, { status: 401 });
    }

    // ---- 2. Scan limit (with monthly reset) ----
    const service = createServiceClient();
    const { data: profile, error: profErr } = await service
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profErr || !profile) {
      return NextResponse.json({ error: "Account profile not found." }, { status: 500 });
    }

    const monthStart = new Date();
    monthStart.setUTCDate(1);
    const currentPeriod = monthStart.toISOString().slice(0, 10);
    let used = profile.scans_used_this_month as number;
    if (profile.usage_period_start !== currentPeriod) {
      used = 0;
      await service
        .from("users")
        .update({ scans_used_this_month: 0, usage_period_start: currentPeriod })
        .eq("id", user.id);
    }
    const unlimited = profile.subscription_status !== "free";
    if (!unlimited && used >= profile.monthly_scan_limit) {
      return NextResponse.json(
        {
          error: `You've used all ${profile.monthly_scan_limit} free scans this month. Upgrade to Plus for unlimited scans.`,
          code: "limit_reached",
        },
        { status: 403 }
      );
    }

    // ---- 3. Validate input ----
    const body = await req.json();
    const inputType = body.input_type as InputType;
    const category = typeof body.category === "string" ? body.category.slice(0, 40) : "unknown";
    let text: string | undefined;
    let url: string | undefined;
    let imageBase64: string | undefined;
    let imageMediaType: string | undefined;

    if (inputType === "text") {
      text = String(body.text || "").slice(0, MAX_TEXT);
      if (!text.trim()) return NextResponse.json({ error: "Paste the message you want to check." }, { status: 400 });
    } else if (inputType === "url") {
      url = String(body.url || "").trim().slice(0, 2000);
      if (!url) return NextResponse.json({ error: "Enter the link you want to check." }, { status: 400 });
    } else if (inputType === "image") {
      imageBase64 = String(body.image_base64 || "");
      imageMediaType = String(body.image_media_type || "image/png");
      if (!imageBase64) return NextResponse.json({ error: "Upload a screenshot or document." }, { status: 400 });
      if (imageBase64.length * 0.75 > MAX_IMAGE_BYTES)
        return NextResponse.json({ error: "Image too large. Please upload a file under 4 MB." }, { status: 400 });
      if (!/^image\/(png|jpe?g|webp|gif)$/.test(imageMediaType))
        return NextResponse.json({ error: "Unsupported file type. Use PNG, JPG, WEBP, or GIF." }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Unknown input type." }, { status: 400 });
    }

    // ---- 4. Enrich URLs ----
    let urlMetadata: string | undefined;
    if (url) urlMetadata = await inspectUrl(url);

    // ---- 5. LLM analysis ----
    const userPrompt = buildUserPrompt({ category, text, url, urlMetadata, hasImage: !!imageBase64 });
    const raw = await callLLM({ userPrompt, imageBase64, imageMediaType });
    const result = parseAnalysis(raw);

    // ---- 6. Persist ----
    const { data: scan, error: insErr } = await service
      .from("scans")
      .insert({
        user_id: user.id,
        input_type: inputType,
        original_text: text ?? null,
        uploaded_file_url: null, // images are analyzed in-memory; not stored (privacy)
        checked_url: url ?? null,
        category,
        risk_level: result.risk_level,
        risk_score: result.risk_score,
        verdict: result.verdict,
        summary: result.summary,
        red_flags: result.red_flags,
        recommended_actions: result.recommended_actions,
        what_not_to_do: result.what_not_to_do,
        safe_reply: result.safe_reply,
        confidence_level: result.confidence_level,
        category_detected: result.category_detected,
      })
      .select("id")
      .single();
    if (insErr) {
      console.error(insErr);
      return NextResponse.json({ error: "Could not save the scan. Try again." }, { status: 500 });
    }

    await service
      .from("users")
      .update({ scans_used_this_month: used + 1 })
      .eq("id", user.id);

    return NextResponse.json({ id: scan.id, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "The analysis failed. Please try again in a moment." },
      { status: 500 }
    );
  }
}
