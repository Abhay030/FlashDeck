/**
 * Spaced Repetition System (SuperMemo-2 Algorithm)
 * 
 * Quality mappings:
 * 0: "again" - Complete blackout, forgot the flashcard.
 * 3: "hard" - Correct response but required significant difficulty/time.
 * 4: "good" - Correct response after a slight hesitation.
 * 5: "easy" - Perfect response immediately.
 */

export type SM2Rating = "again" | "hard" | "good" | "easy";

export interface SM2State {
  interval: number;
  repetition: number;
  eFactor: number;
  dueDate: Date;
}

export function calculateSM2(
  rating: SM2Rating,
  currentState: Omit<SM2State, "dueDate">
): SM2State {
  let { interval, repetition, eFactor } = currentState;
  
  // Map our UI string ratings to SM-2 numeric quality scales
  let quality = 0;
  switch (rating) {
    case "again": quality = 0; break;
    case "hard": quality = 3; break;
    case "good": quality = 4; break;
    case "easy": quality = 5; break;
  }

  // If the user failed, reset rep count
  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    // If the user succeeded, increase interval exponentially based on eFactor
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * eFactor);
    }
    repetition++;
  }

  // Calculate new Easiness Factor
  eFactor = eFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Hard limits for EF
  if (eFactor < 1.3) eFactor = 1.3;

  // Calculate Due Date based on today + interval days
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    interval,
    repetition,
    eFactor,
    dueDate
  };
}
