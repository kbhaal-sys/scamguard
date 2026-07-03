// -----------------------------------------------------------------
// OCR integration placeholder.
//
// In the current MVP, uploaded screenshots are sent directly to a
// vision-capable LLM (OpenAI gpt-4o / Anthropic Claude), which reads
// the text in the image as part of the analysis — so a separate OCR
// step is not required for the core flow.
//
// If you later need standalone OCR (e.g. to store extracted text or
// support non-vision models), wire it here. Good options:
//   - tesseract.js (self-hosted, free)
//   - Google Cloud Vision / AWS Textract (managed)
// -----------------------------------------------------------------
export async function extractTextFromImage(_base64: string): Promise<string | null> {
  return null; // handled by the vision LLM in this MVP
}
