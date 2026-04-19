/** App route allows up to 10 MB; Vercel serverless request body is ~4.5 MB — stay under that on their infra. */
const MB = 1024 * 1024;
const APP_MAX = 10 * MB;
const VERCEL_SAFE = Math.floor(4.4 * MB);

/**
 * Max upload size for client validation. On *.vercel.app we cap below the platform limit.
 * Optional override: NEXT_PUBLIC_MAX_UPLOAD_MB (number, e.g. 4)
 */
export function getClientMaxUploadBytes(): number {
  const raw = process.env.NEXT_PUBLIC_MAX_UPLOAD_MB;
  if (raw != null && raw !== "") {
    const n = Number(raw);
    if (!Number.isNaN(n) && n > 0) return Math.min(n * MB, APP_MAX);
  }
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return APP_MAX;
    if (h.endsWith(".vercel.app")) return VERCEL_SAFE;
  }
  return APP_MAX;
}
