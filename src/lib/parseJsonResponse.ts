/**
 * Parse JSON from a fetch Response body. Plain `response.json()` throws obscure errors
 * (e.g. Safari: "The string did not match the pattern") when the server returns HTML
 * or plain text — common for 413/502/500 pages on serverless hosts.
 */
export async function parseJsonResponse<T = Record<string, unknown>>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text.trim()) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    const sniff = text.slice(0, 200).toLowerCase();
    const looksHtml = sniff.includes("<!doctype") || sniff.includes("<html");
    if (response.status === 413) {
      throw new Error(
        "Upload too large for this server. Vercel limits request bodies to about 4.5 MB — use a smaller PDF, or switch to direct-to-storage uploads for bigger files."
      );
    }
    if (response.status === 500 && looksHtml) {
      throw new Error(
        "Server error (500) with an HTML error page — usually a crash, timeout, or response too large on Vercel. Open Vercel → your deployment → Functions → Logs while retrying. Confirm MONGODB_URI and GROQ_API_KEY for Production; try a smaller PDF."
      );
    }
    throw new Error(
      `Server returned a non-JSON response (${response.status}). Check Vercel → Deployment → Logs, and confirm MONGODB_URI and GROQ_API_KEY are set for Production.`
    );
  }
}
