import { groqClient, withRetry } from "./groq";
import { Chunk } from "@/lib/pdf/chunker";

// Models we can switch between. 
// llama-3.1-8b-instant is blazing fast for small discrete tasks like concept extraction.
const GROQ_MODEL = "llama-3.1-8b-instant";

/**
 * Extracts raw educational concepts from a single text chunk.
 * Enforces JSON mode for programmatic array merging.
 */
async function extractConceptsFromChunk(chunk: Chunk): Promise<string[]> {
  const systemPrompt = `You are an expert pedagogical AI. 
Your objective is to read a chunk of an educational text and extract ONLY the distinct, high-level major concepts or topics taught within it.
Ignore all filler text, repetitive examples, anecdotes, or minor irrelevant details.
Extract the concepts as concise bullet points (maximum 5 words each).

CRITICAL: Return the response strictly as a JSON Object containing a single array called "concepts". 
Example Output: 
{
  "concepts": ["Mitochondria structure", "Cellular respiration cycle", "ATP production"]
}
If the text contains no meaningful educational concepts, return: {"concepts": []}
Do not return conversational text. Only valid JSON.`;

  // We append the detected heading natively if we have one to anchor the LLM
  let contextSnippet = chunk.content;
  if (chunk.sectionHeading) {
    contextSnippet = `\n[CONTEXT ANCHOR - Section: "${chunk.sectionHeading}"]\n\n` + contextSnippet;
  }

  const completion = await groqClient.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Extract concepts from this text:\n\n${contextSnippet}` }
    ],
    model: GROQ_MODEL,
    temperature: 0.1, // Low temp for strictly factual, deterministic extraction
    response_format: { type: "json_object" }, // Requires root to be {}
  });

  const content = completion.choices[0]?.message?.content || '{"concepts": []}';
  
  try {
    const parsed = JSON.parse(content);
    if (parsed.concepts && Array.isArray(parsed.concepts)) {
      return parsed.concepts;
    } else if (parsed && typeof parsed === 'object') {
      // Fallback
      const firstArrayValue = Object.values(parsed).find(val => Array.isArray(val));
      if (firstArrayValue) return firstArrayValue as string[];
    }
  } catch (err) {
    console.error("[AI Extractor] Failed to parse JSON from LLM: ", content);
  }

  return [];
}

/**
 * Orchestrates the sequential processing of chunks.
 * We avoid Promise.all() across 50 chunks because Groq Free Tier has strict TPM/RPM rate limits.
 */
export async function extractAllConcepts(chunks: Chunk[]): Promise<string[]> {
  const aggregatedConcepts = new Set<string>();
  
  console.log(`[AI Pipeline] Starting batched concept extraction for ${chunks.length} chunks...`);

  // BATCHING ALGORITHM
  // To avoid 120+ second loops that trigger Vercel Serverless timeouts,
  // we execute requests concurrently, broken into parallel batches of 5 to respect Groq rate limits.
  const BATCH_SIZE = 5;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(`[AI Pipeline] Processing Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}...`);
    
    // Execute multiple LLM extractions purely in parallel
    const batchResults = await Promise.all(
      batch.map(chunk => withRetry(() => extractConceptsFromChunk(chunk), 3, 2000))
    );

    // Flatten and clean the parallel results
    batchResults.flat().forEach(concept => {
      if (concept && typeof concept === 'string') {
        const cleanStr = concept.trim().charAt(0).toUpperCase() + concept.trim().slice(1);
        if (cleanStr.length > 2) {
           aggregatedConcepts.add(cleanStr);
        }
      }
    });
  }

  console.log(`[AI Pipeline] Extraction finished. Found ${aggregatedConcepts.size} unique raw concepts.`);
  return Array.from(aggregatedConcepts);
}
