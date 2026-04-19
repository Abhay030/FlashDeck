const { PDFParse } = require("pdf-parse");
import { cleanExtractedText } from "./cleaner";

export interface ParseResult {
  text: string;
  numpages: number;
  info: any;
  error?: string;
}

/**
 * Parses a PDF Buffer and cleans the text structure
 * Uses pdf-parse v2 API (PDFParse class)
 * @param dataBuffer The PDF file as a Buffer
 * @returns Cleaned text and metadata
 */
export async function parsePdfBuffer(dataBuffer: Buffer): Promise<ParseResult> {
  let parser = null;
  try {
    // Initialize standard PDF parser
    parser = new PDFParse({ data: dataBuffer });
    
    // getText automatically enforces logical layout via lineEnforce
    const textResult = await parser.getText({
      lineEnforce: true,
      pageJoiner: "\n\n--- PAGE BREAK ---\n\n",
    });
    
    // Optionally grab metadata
    const infoResult = await parser.getInfo();
    
    // Clean the extracted raw text
    const cleanedText = cleanExtractedText(textResult.text);
    
    console.log(`[PDF Parser] Successfully extracted ${textResult.total} pages.`);

    return {
      text: cleanedText,
      numpages: textResult.total,
      info: infoResult.info || {},
    };
  } catch (error: any) {
    console.error("[PDF Parser] Failed to parse PDF securely:", error);
    return {
      text: "",
      numpages: 0,
      info: {},
      error: error.message || "Unknown parsing error",
    };
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}
