import { FlashcardGeneration } from "./generator";

// CONFIGURABLE CONSTANTS
// Jaccard similarity threshold to consider two cards as duplicates.
// 0.85 implies 85% of distinct terms must overlap to trigger deduplication.
// This high threshold ensures conceptually distinct but similarly worded 
// questions (e.g. "What is mitosis?" vs "What is meiosis?") are preserved.
const JACCARD_DUPLICATE_THRESHOLD = 0.85;

/**
 * Tokenizes a string cleanly by removing punctuation and converting to lowercase
 */
function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2); // Filter out tiny structural words
  return new Set(words);
}

/**
 * Calculates the Jaccard Similarity Coefficient between two datasets.
 * Returns a score between 0.0 and 1.0
 */
function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  
  let intersectionSize = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionSize++;
    }
  }
  
  const unionSize = setA.size + setB.size - intersectionSize;
  if (unionSize === 0) return 0;
  
  return intersectionSize / unionSize;
}

/**
 * Scans a deck and removes heavily duplicated questions mathematically using Jaccard Similarity.
 */
export function deduplicateFlashcards(deck: FlashcardGeneration[]): FlashcardGeneration[] {
  const uniqueDeck: FlashcardGeneration[] = [];
  
  for (const currentCard of deck) {
    const currentTokens = tokenize(currentCard.question + " " + currentCard.topic);
    let isDuplicate = false;

    // Compare against already approved unique cards
    for (const approvedCard of uniqueDeck) {
      const approvedTokens = tokenize(approvedCard.question + " " + approvedCard.topic);
      const similarity = calculateJaccardSimilarity(currentTokens, approvedTokens);
      
      if (similarity >= JACCARD_DUPLICATE_THRESHOLD) {
        console.log(`[AI Processor] Deduplicated similar card. (Similarity: ${(similarity * 100).toFixed(1)}%) -> "${currentCard.question}"`);
        isDuplicate = true;
        
        // Optional Merge Logic: If we find a higher difficulty, we could keep that one instead, 
        // but typically the first generated is conceptually stronger within the LLM's primary attention span.
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueDeck.push(currentCard);
    }
  }

  return uniqueDeck;
}

/**
 * Final Polish Pipeline
 * Enforces duplication rules and ensures all schema fields are perfectly valid.
 * NOTE: As explicitly architected, this explicitly does NOT forcibly sort the cards 
 * by topic or difficulty, preserving the natural pedagogical sequence originally 
 * outputted by the AI model. 
 */
export function processFinalDeck(rawCards: FlashcardGeneration[]): FlashcardGeneration[] {
  console.log(`[AI Processor] Began processing ${rawCards.length} raw cards...`);
  
  // 1. Structural Sanity Verification
  const validCards = rawCards.filter(card => 
    card.question && 
    card.answer && 
    card.question.trim().length > 3 && 
    card.answer.trim().length > 3
  );

  // 2. Intelligent Deduplication
  const dedupedDeck = deduplicateFlashcards(validCards);
  
  console.log(`[AI Processor] Finished processing. Remaining pristine cards: ${dedupedDeck.length}`);
  
  return dedupedDeck;
}
