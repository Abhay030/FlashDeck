/**
 * Single 0–100 "deck health" score from dashboard-style aggregates.
 * Higher = more mastered, fewer due/weak relative to deck size.
 */
export function computeDeckHealth(deck: {
  totalCardsCount: number;
  dueCardsCount: number;
  weakCardsCount: number;
  masteredCardsCount: number;
}): number {
  const t = Math.max(deck.totalCardsCount, 1);
  const masteryRatio = deck.masteredCardsCount / t;
  const duePressure = Math.min(deck.dueCardsCount / t, 1);
  const weakPressure = Math.min(deck.weakCardsCount / t, 1);

  const score =
    masteryRatio * 42 +
    (1 - duePressure) * 33 +
    (1 - weakPressure) * 25;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function healthLabel(score: number): "Strong" | "Solid" | "Needs care" {
  if (score >= 72) return "Strong";
  if (score >= 45) return "Solid";
  return "Needs care";
}
