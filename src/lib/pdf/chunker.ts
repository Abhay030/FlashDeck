export interface Chunk {
  index: number;
  content: string;
  estimatedTokens: number;
  sectionHeading: string | null;
}

export interface ChunkerConfig {
  maxTokensPerChunk?: number; // default: 1000
  overlapTokens?: number; // default: 100
}

/**
 * Heuristically estimates tokens in a string
 * (Roughly 1 token = 4 characters in English)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Heuristically determines if a line is a section heading
 */
function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length === 0) return false;
  
  // Rule 1: Too long to be a normal heading
  if (trimmed.length > 80) return false;
  
  // Rule 2: Mostly uppercase letters
  const upperCaseRegex = /^[A-Z0-9\s:.-]+$/;
  if (upperCaseRegex.test(trimmed) && trimmed.length > 4) return true;
  
  // Rule 3: Short prefix like "Chapter 1", "Section 2.1"
  const chapterRegex = /^(?:Chapter|Section|Module|Unit)\s+\d+(?:[a-zA-Z.:]+)?/i;
  if (chapterRegex.test(trimmed)) return true;

  // Rule 4: Short, capitalized title Case
  // E.g., "The Mitochondria"
  const titleRegex = /^([A-Z][a-z0-9]+\s+)+[A-Z][a-z0-9]+$/;
  if (titleRegex.test(trimmed)) return true;

  return false;
}

/**
 * Intelligently chunks cleaned PDF text based on semantic paragraph boundaries
 * and detects potential section headings.
 */
export function chunkText(text: string, config: ChunkerConfig = {}): Chunk[] {
  const maxTokens = config.maxTokensPerChunk || 1000;
  // Overlap is useful to ensure concepts don't hard-split, 
  // but for flashcards, clean split per paragraph is usually better.
  // We keep the option open.
  
  // Split the text into logical paragraphs (using double newline minimum)
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 0);
  
  const chunks: Chunk[] = [];
  let currentChunkContent: string[] = [];
  let currentTokenCount = 0;
  let currentHeading: string | null = null;
  let chunkIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const paraTokens = estimateTokens(paragraph);
    
    // Check if paragraph is actually a heading
    if (isHeading(paragraph)) {
      // If we already have accumulated text and hit a NEW heading, 
      // we might want to flush the current chunk to keep sections separate logically.
      if (currentChunkContent.length > 0) {
        chunks.push({
          index: chunkIndex++,
          content: currentChunkContent.join("\n\n"),
          estimatedTokens: currentTokenCount,
          sectionHeading: currentHeading,
        });
        currentChunkContent = [];
        currentTokenCount = 0;
      }
      currentHeading = paragraph;
      // We also include the heading inside the next chunk content so the AI has context
      currentChunkContent.push(paragraph);
      currentTokenCount += paraTokens;
      continue;
    }

    // If adding this paragraph exceeds the chunk limit (and we already have content)
    if (currentTokenCount + paraTokens > maxTokens && currentChunkContent.length > 0) {
      const fullContent = currentChunkContent.join("\n\n");
      
      // Extract ~200 character overlap to preserve context across chunks
      const overlapRaw = fullContent.slice(-200);
      const safeOverlap = overlapRaw.substring(overlapRaw.indexOf(" ") + 1);
      const overlapText = safeOverlap.length > 20 ? "... " + safeOverlap : "";

      // Flush the current chunk
      chunks.push({
        index: chunkIndex++,
        content: fullContent,
        estimatedTokens: currentTokenCount,
        sectionHeading: currentHeading,
      });
      
      // Start a new chunk seeded with the overlap
      currentChunkContent = overlapText ? [overlapText] : [];
      currentTokenCount = overlapText ? estimateTokens(overlapText) : 0;
    }

    // Add paragraph to current accumulation
    currentChunkContent.push(paragraph);
    currentTokenCount += paraTokens;
    
    // Fallback: If a single paragraph is absurdly long (exceeds max tokens natively), 
    // we would theoretically split by sentences, but for now we let it pass 
    // to preserve semantic integrity, as LLMs can handle slight overflows.
  }

  // Flush the remaining chunk
  if (currentChunkContent.length > 0) {
    chunks.push({
      index: chunkIndex++,
      content: currentChunkContent.join("\n\n"),
      estimatedTokens: currentTokenCount,
      sectionHeading: currentHeading,
    });
  }

  return chunks;
}
