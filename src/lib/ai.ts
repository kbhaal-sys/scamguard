import type { AnalysisResult } from "./types";

// ---------------------------------------------------------------
// Scam-analysis prompt. The model must return STRICT JSON only.
// ---------------------------------------------------------------
export const SYSTEM_PROMPT = `You are the analysis engine of "Scam Guard", a consumer app that helps
non-technical people (including older adults) decide whether a message, link,
invoice, offer, or document is safe, suspicious, or likely a scam.

Analysis framework — apply in order:
1. Identify the context (who is supposedly contacting the user and why).
2. Detect known scam patterns for that context.
3. Check specifically for: urgency and pressure, emotional manipulation,
   impersonation of companies or authorities, suspicious payment requests,
   mismatched or look-alike domains, crypto or irreversible payment methods,
   requests for personal data / card details / codes, fake authority language,
   poor formatting or machine-translated text, unrealistic promises, and
   unusual communication channels for this kind of message.
4. Classify the overall risk.
5. Explain the result in simple, plain language a non-technical person understands.
6. Give concrete, doable actions.
7. Write a short safe reply the user could send.

Scoring guidance:
- 0–24  => "Low"       (no meaningful indicators found)
- 25–54 => "Medium"    (some indicators; verify before acting)
- 55–79 => "High"      (multiple strong indicators; likely a scam)
- 80–100 => "Critical" (strongly consistent with known scam patterns)

Wording rules (mandatory):
- NEVER say something is 100% safe, "definitely safe", or "guaranteed".
- NEVER claim the user "is protected".
- Do not give legal or financial advice, and do not present the output as such.
- Prefer phrasing like: "This appears suspicious.", "This has several scam
  indicators.", "Do not proceed until you verify through an official channel.",
  "This looks consistent with known scam patterns."
- Even for Low risk, recommend verifying through official channels.
- Plain language. Short sentences. No technical jargon.

Output format (mandatory):
Return ONLY a single JSON object, no markdown fences, no commentary, matching:
{
  "risk_level": "Low | Medium | High | Critical",
  "risk_score": number (0-100, consistent with risk_level),
  "verdict": string (one or two short sentences, plain language),
  "summary": string (2-4 sentences explaining the situation),
  "red_flags": [ { "title": string, "explanation": string } ],
  "recommended_actions": [string],
  "what_not_to_do": [string],
  "safe_reply": string (a short message the user can send, or "" if replying is not advised),
  "confidence_level": "Low | Medium | High",
  "category_detected": string
}
If the input is empty, unreadable, or not analyzable, still return valid JSON
with confidence_level "Low" and explain in "summary" what was missing.`;

export function buildUserPrompt(opts: {
  category: string;
  text?: string;
  url?: string;
  urlMetadata?: string;
  hasImage: boolean;
}): string {
  const parts: string[] = [];
  parts.push(`User-selected situation type: ${opts.category}`);
  if (opts.text) parts.push(`--- PASTED CONTENT START ---\n${opts.text}\n--- PASTED CONTENT END ---`);
  if (opts.url) parts.push(`URL to check: ${opts.url}`);
  if (opts.urlMetadata) parts.push(`Automated URL inspection results:\n${opts.urlMetadata}`);
  if (opts.hasImage)
    parts.push(
      "An image (screenshot or document photo) is attached. Read all visible text in it and analyze it as the primary content."
    );
  parts.push("Analyze now and return the JSON object.");
  return parts.join("\n\n");
}

// ---------------------------------------------------------------
// Provider-agnostic LLM call (OpenAI or Anthropic), images supported.
// ---------------------------------------------------------------
interface LLMInput {
  userPrompt: string;
  imageBase64?: string;
  imageMediaType?: string;
}

export async function callLLM(input: LLMInput): Promise<string> {
  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();
  if (provider === "anthropic") return callAnthropic(input);
  return callOpenAI(input);
}

async function callOpenAI({ userPrompt, imageBase64, imageMediaType }: LLMInput): Promise<string> {
  const content: unknown[] = [{ type: "text", text: userPrompt }];
  if (imageBase64) {
    content.push({
      type: "image_url",
      image_url: { url: `data:${imageMediaType || "image/png"};base64,${imageBase64}` },
    });
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM error (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic({ userPrompt, imageBase64, imageMediaType }: LLMInput): Promise<string> {
  const content: unknown[] = [];
  if (imageBase64) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: imageMediaType || "image/png", data: imageBase64 },
    });
  }
  content.push({ type: "text", text: userPrompt });
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 2000,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    }),
  });
  if (!res.ok) throw new Error(`LLM error (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return (data.content || [])
    .map((b: { type: string; text?: string }) => (b.type === "text" ? b.text : ""))
    .join("");
}

// ---------------------------------------------------------------
// Strict-JSON parsing + validation with safe clamping.
// ---------------------------------------------------------------
const LEVELS = ["Low", "Medium", "High", "Critical"] as const;
const CONF = ["Low", "Medium", "High"] as const;

export function parseAnalysis(raw: string): AnalysisResult {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON.");
  const obj = JSON.parse(cleaned.slice(start, end + 1));

  const level = LEVELS.includes(obj.risk_level) ? obj.risk_level : "Medium";
  const score = Math.max(0, Math.min(100, Math.round(Number(obj.risk_score) || 0)));
  const strArr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 12) : [];
  const flags = Array.isArray(obj.red_flags)
    ? obj.red_flags
        .filter((f: unknown) => f && typeof f === "object")
        .map((f: { title?: unknown; explanation?: unknown }) => ({
          title: String(f.title ?? "").slice(0, 200),
          explanation: String(f.explanation ?? "").slice(0, 600),
        }))
        .slice(0, 12)
    : [];

  return {
    risk_level: level,
    risk_score: score,
    verdict: String(obj.verdict ?? "").slice(0, 500),
    summary: String(obj.summary ?? "").slice(0, 1500),
    red_flags: flags,
    recommended_actions: strArr(obj.recommended_actions),
    what_not_to_do: strArr(obj.what_not_to_do),
    safe_reply: String(obj.safe_reply ?? "").slice(0, 800),
    confidence_level: CONF.includes(obj.confidence_level) ? obj.confidence_level : "Medium",
    category_detected: String(obj.category_detected ?? "unknown").slice(0, 100),
  };
}
