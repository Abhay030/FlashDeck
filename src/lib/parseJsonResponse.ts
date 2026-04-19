/**
 * Parse JSON from a fetch Response body. Plain `response.json()` throws obscure errors
 * (e.g. Safari: "The string did not match the pattern") when the server returns HTML
 * or plain text — common for 413/502 pages on serverless hosts.
 */
export async function parseJsonResponse<T = Record<string, unknown>>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text.trim()) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    if (response.status === 413) {
      throw new Error(
        "Upload too large for this server. Vercel limits request bodies to about 4.5 MB — use a smaller PDF, or switch to direct-to-storage uploads for bigger files."
      );
    }
    throw new Error(
      `Server returned a non-JSON response (${response.status}). Check Vercel → Deployment → Logs, and confirm MONGODB_URI and GROQ_API_KEY are set for Production.`
    );
  }
}
