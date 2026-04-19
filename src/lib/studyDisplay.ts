/** Human-readable line for the card’s current due schedule (client-side, before rating updates). */
export function formatDueSchedule(due: string | Date | undefined): string {
  if (!due) return "";
  const d = typeof due === "string" ? new Date(due) : due;
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  if (d.getTime() <= now.getTime()) {
    return "Due now — spaced repetition";
  }

  return `Scheduled: ${d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })}`;
}
