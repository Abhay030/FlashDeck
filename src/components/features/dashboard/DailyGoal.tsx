"use client";

import { motion } from "framer-motion";
import { Flame, CheckCircle2, Sunrise, TrendingUp } from "lucide-react";

const DAILY_GOAL = 10;

interface DailyGoalProps {
  cardsStudiedToday: number;
}

function getMotivationalMessage(count: number): string {
  if (count === 0) return "Consistency beats intensity. Start with just 5 cards today.";
  if (count < 4) return "Great start! A few more to build the habit.";
  if (count < DAILY_GOAL) return `${DAILY_GOAL - count} more to hit your goal — you're almost there!`;
  if (count < DAILY_GOAL + 5) return "Goal smashed! Every extra card is a bonus.";
  return `Outstanding! You've reviewed ${count} cards today — keep the momentum!`;
}

export function DailyGoal({ cardsStudiedToday }: DailyGoalProps) {
  const progress = Math.min(cardsStudiedToday / DAILY_GOAL, 1);
  const isComplete = cardsStudiedToday >= DAILY_GOAL;
  const hasStarted = cardsStudiedToday > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="h-full rounded-2xl bg-card border border-border p-5 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {isComplete ? (
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          ) : hasStarted ? (
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl flex-shrink-0">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
          ) : (
            <div className="rounded-xl bg-primary/15 p-2 shrink-0">
              <Sunrise className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Daily goal</p>
              {isComplete && (
                <span className="text-[10px] font-black text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  ✓ Complete
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {isComplete
                ? "🎉 Goal completed! Great work — every card strengthens your memory."
                : getMotivationalMessage(cardsStudiedToday)}
            </p>
          </div>
        </div>

        {/* Counter badge */}
        <div className="flex items-center gap-1.5 text-sm font-black flex-shrink-0">
          <TrendingUp className={`w-4 h-4 ${isComplete ? "text-green-500" : hasStarted ? "text-amber-500" : "text-muted-foreground"}`} />
          <span
            className={`tabular-nums ${
              isComplete
                ? "text-green-600 dark:text-green-400"
                : hasStarted
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground"
            }`}
          >
            {cardsStudiedToday}
            <span className="font-medium text-muted-foreground">/{DAILY_GOAL}</span>
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isComplete ? "bg-green-500" : "bg-primary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
        />
      </div>

      {/* Progress text below bar */}
      {!isComplete && hasStarted && (
        <p className="text-[11px] text-muted-foreground mt-2 font-semibold">
          {Math.round(progress * 100)}% of daily goal reached
        </p>
      )}
    </motion.div>
  );
}
