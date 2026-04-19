/**
 * Cleaner Utility for PDF Text Extraction
 */

/**
 * Strips common references, bibliographies, and table of contents
 * @param text The raw extracted text from the PDF
 * @returns Text with bibliography and TOC heuristically removed
 */
function removeDiscardableSections(text: string): string {
  // 1. Bibliography / References cutoff (Heuristic: usually towards the end)
  // We look for "References" or "Bibliography" on a line by itself, optionally preceded by numbers
  const referenceRegex = /\n\s*(?:[0-9]+[.)])?\s*(?:References|Bibliography|Works Cited)\s*\n/i;
  
  const refMatch = text.match(referenceRegex);
  if (refMatch && refMatch.index !== undefined) {
    // A safeguard: Only cut off if References are in the last 20% of the document to avoid false positives
    const cutoffIndex = refMatch.index;
    if (cutoffIndex > text.length * 0.7) {
      text = text.substring(0, cutoffIndex);
    }
  }

  // 2. Table of Contents removal (Heuristic: multiple lines ending with dots and numbers)
  // E.g. "Chapter 1 ...... 5"
  const tocRegex = /^(?:[\w\s]+)(?:[.]{4,}|[-]{4,}|\s{4,})\s*\d+\s*$/gm;
  text = text.replace(tocRegex, "");
  
  return text;
}

/**
 * Main cleaning function pipeline
 * @param rawText Extracted text from pdf-parse
 * @returns Cleaned text optimized for chunking
 */
export function cleanExtractedText(rawText: string): string {
  if (!rawText) return "";

  // 1. Remove references and TOC
  let cleaned = removeDiscardableSections(rawText);

  // 2. Remove standard page numbers (e.g. standalone numbers on a line)
  // Matches "12", "- 12 -", "Page 12" on its own line
  const pageNoRegex = /^\s*(?:-\s*)?(?:Page\s*)?\d+(?:\s*-)?\s*$/gmi;
  cleaned = cleaned.replace(pageNoRegex, "");

  // 3. Remove URLs/Links which might pollute AI context (optional, but good for pure concepts)
  const urlRegex = /https?:\/\/[^\s]+/g;
  cleaned = cleaned.replace(urlRegex, "[Link removed]");

  // 4. Normalize invisible characters / weird Unicode spaces to standard space
  // eslint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ");

  // 5. Cleanup repeated blank lines
  // Replace 3+ consecutive newlines with exactly 2 newlines (preserves paragraph breaks)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // 6. Fix hyphenated words broken across lines
  // e.g. "infor-\nmation" -> "information "
  cleaned = cleaned.replace(/([a-z])-\n\s*([a-z])/gi, "$1$2");

  // 7. Remove leading/trailing whitespace
  return cleaned.trim();
}
