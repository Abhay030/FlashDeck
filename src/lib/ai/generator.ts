import { groqClient, withRetry } from "./groq";

export interface FlashcardGeneration {
  question: string;
  answer: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string; // which concept it covers
}

// Default to 8B instant so serverless (Vercel) stays within time limits; override for quality on powerful hosts.
const GENERATION_MODEL =
  process.env.GROQ_GENERATION_MODEL?.trim() || "llama-3.1-8b-instant";

/**
 * Transforms isolated raw concepts into high-quality educational flashcards.
 * Limits the output to a controlled number of cards to save tokens.
 */
export async function generateFlashcards(
  concepts: string[], 
  limit: number = 20
): Promise<FlashcardGeneration[]> {
  if (!concepts || concepts.length === 0) return [];

  console.log(`[AI Generator] Injecting ${concepts.length} concepts to generate ${limit} flashcards...`);

  const systemPrompt = `You are a master educator and professor creating a spaced-repetition flashcard deck for your students.
Your task is to take a raw list of pedagogical concepts/topics and generate exactly ${limit} high-quality, thought-provoking flashcards.

QUALITY GUIDELINES:
1. DO NOT create shallow "fill in the blank" trivia. The cards must test conceptual understanding, definitions, relationships, and applications.
2. The "answer" should be comprehensive but readable (2-4 sentences max), mimicking an expert teacher's explanation.
3. Ensure absolute variety in the questions (e.g., "Compare X and Y", "What is the primary function of Z?", "In what scenario would you apply W?").
4. Cards must be distinctly unique. No duplicates.
5. Difficulty should be properly evaluated based on the nuance of the material.

OUTPUT SCHEMA (STRICT JSON ONLY):
You must return only a valid JSON Object containing a single array called "flashcards". Do not include introductory text.
Format:
{
  "flashcards": [
    {
      "question": "string",
      "answer": "string",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "topic": "string"
    }
  ]
}`;

  // We limit the massive array of concepts to the core 50 to avoid blowing up the context window
  // and causing the AI to lose focus on the instruction set.
  const conceptSnippet = concepts.slice(0, 50).map(c => `- ${c}`).join('\n');

  const completion = await withRetry(async () => {
    return await groqClient.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Create exactly ${limit} high-value flashcards derived from these core topics:\n\n${conceptSnippet}`
        }
      ],
      model: GENERATION_MODEL,
      temperature: 0.3, // slight temperature for creative educational variations
      response_format: { type: "json_object" },
      max_tokens: 4096,
    });
  }, 3, 2000);

  const content = completion.choices[0]?.message?.content || '{"flashcards": []}';

  try {
    const rawParsed = JSON.parse(content);
    
    // Safety check for LLMs nesting array 
    let deck: any[] = [];
    if (rawParsed.flashcards && Array.isArray(rawParsed.flashcards)) {
      deck = rawParsed.flashcards;
    } else if (typeof rawParsed === "object" && rawParsed !== null) {
      // Find the first array property
      const validArray = Object.values(rawParsed).find(val => Array.isArray(val));
      if (validArray) deck = validArray as any[];
    }

    // Filter to ensure schema matching
    const validatedDeck: FlashcardGeneration[] = deck.filter((card) => 
      typeof card.question === "string" && typeof card.answer === "string"
    ).map(card => ({
      question: card.question,
      answer: card.answer,
      difficulty: ["beginner", "intermediate", "advanced"].includes(card.difficulty) 
        ? card.difficulty 
        : "intermediate", 
      topic: card.topic || "General Concept"
    }));

    // Enforce the strict physical limit specified in our backend requirement
    return validatedDeck.slice(0, limit);

  } catch (err) {
    console.error("[AI Generator] Failed to parse semantic flashcard JSON:", err);
    return [];
  }
}
