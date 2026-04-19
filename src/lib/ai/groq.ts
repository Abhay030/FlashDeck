import Groq from "groq-sdk";

// Modular initialization allows us to quickly swap or add 
// fallback APIs (like OpenAI) if Groq fails in the future.
const groqApiKey = process.env.GROQ_API_KEY || "";

export const groqClient = new Groq({
  apiKey: groqApiKey,
  // DANGER: Only enable dangerouslyAllowBrowser for local testing if running client-side,
  // but we enforce all API processing to happen securely on the Node.js backend.
});

/**
 * Standard retry wrapper for rate limits (HTTP 429)
 * Used heavily for AI inference loops.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      // If we hit a standard 429 rate limit or 503 Service Unavailable, back off
      if (error?.status === 429 || error?.status >= 500) {
        console.warn(`[AI Engine] Rate limit or server error hit (Attempt ${attempt}/${maxRetries}). Retrying in ${delayMs / 1000}s...`);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(1.5, attempt - 1)));
      } else {
        // If it's a 400 Bad Request or 401 Unauthorized, fail immediately
        throw error;
      }
    }
  }
  throw new Error(`[AI Engine] Operation failed after ${maxRetries} attempts.`);
}
