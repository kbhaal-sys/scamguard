// Lightweight URL inspection module.
// Produces a plain-text report that is fed to the LLM as extra context.

const SUSPICIOUS_TLDS = [
  ".top", ".xyz", ".click", ".win", ".loan", ".gq", ".tk", ".ml", ".cf",
  ".buzz", ".rest", ".icu", ".cam", ".bar", ".monster",
];

const URL_SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "rb.gy", "shorturl.at",
];

export async function inspectUrl(rawUrl: string): Promise<string> {
  const notes: string[] = [];
  let url: URL;
  try {
    url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  } catch {
    return "The URL could not be parsed — it is not a valid web address.";
  }

  notes.push(`Hostname: ${url.hostname}`);
  notes.push(`Protocol: ${url.protocol}`);

  if (url.protocol !== "https:") notes.push("FLAG: not using HTTPS.");
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname)) notes.push("FLAG: raw IP address instead of a domain.");
  if (url.hostname.startsWith("xn--") || url.hostname.includes(".xn--"))
    notes.push("FLAG: punycode/internationalized domain — often used for look-alike domains.");
  if (SUSPICIOUS_TLDS.some((t) => url.hostname.endsWith(t)))
    notes.push(`FLAG: top-level domain "${url.hostname.split(".").pop()}" is frequently abused in scams.`);
  if (URL_SHORTENERS.includes(url.hostname))
    notes.push("FLAG: URL shortener — the real destination is hidden.");
  const subCount = url.hostname.split(".").length - 2;
  if (subCount >= 2) notes.push("FLAG: many subdomains — often used to fake official-looking addresses.");
  if (/\b(login|verify|secure|account|update|confirm|wallet|refund)\b/i.test(url.hostname + url.pathname))
    notes.push("NOTE: contains credential/payment-related keywords (login/verify/secure/refund...).");
  if (url.hostname.includes("-") && /(bank|post|dhl|fan|olx|paypal|revolut|netflix|anaf)/i.test(url.hostname))
    notes.push("FLAG: brand name combined with hyphens — a common look-alike pattern.");

  // Try to fetch page metadata (best effort, short timeout, no redirects followed blindly)
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(url.toString(), {
      signal: ctrl.signal,
      redirect: "manual",
      headers: { "User-Agent": "ScamGuardBot/1.0 (+safety check)" },
    });
    clearTimeout(t);
    notes.push(`HTTP status: ${res.status}`);
    const loc = res.headers.get("location");
    if (loc) notes.push(`Redirects to: ${loc}`);
    const type = res.headers.get("content-type") || "";
    if (type.includes("text/html")) {
      const html = (await res.text()).slice(0, 60000);
      const title = html.match(/<title[^>]*>([^<]{0,200})/i)?.[1]?.trim();
      if (title) notes.push(`Page title: ${title}`);
      const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{0,300})/i)?.[1];
      if (desc) notes.push(`Meta description: ${desc}`);
      if (/<input[^>]+type=["']password/i.test(html)) notes.push("FLAG: the page contains a password field.");
      if (/card[\s_-]?number|cvv|cvc/i.test(html)) notes.push("FLAG: the page appears to ask for card details.");
    }
  } catch {
    notes.push("The page could not be fetched (timeout, blocked, or offline). That alone is not proof of a scam.");
  }

  return notes.join("\n");
}
