"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertTriangle, Target, CheckCircle2, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const DAILY_GOAL = 10;

interface SmartNudgeProps {
  currentStreak: number;
  studiedToday: boolean;
  weakCards: number;
  cardsStudiedToday: number;
  cardsDueToday: number;
  /** Shown when no contextual nudge applies (keeps the column from feeling empty) */
  fallback?: ReactNode;
}

interface NudgeConfig {
  icon: React.ReactNode;
  message: string;
  sub: string;
  bg: string;
  border: string;
  iconBg: string;
}

function getNudge(
  currentStreak: number,
  studiedToday: boolean,
  weakCards: number,
  cardsStudiedToday: number,
  cardsDueToday: number
): NudgeConfig | null {
  const remaining = DAILY_GOAL - cardsStudiedToday;

  // Priority 1: Streak at risk (has streak but hasn't studied yet today)
  if (currentStreak > 0 && !studiedToday) {
    return {
      icon: <Flame className="w-4 h-4" />,
      message: `Your ${currentStreak}-day streak is at risk!`,
      sub: "Study at least one card today to keep it alive.",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-800/50",
      iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
    };
  }

  // Priority 2: Close to daily goal (2-3 cards away)
  if (cardsStudiedToday > 0 && remaining > 0 && remaining <= 3) {
    return {
      icon: <Target className="w-4 h-4" />,
      message: `Almost there — just ${remaining} more card${remaining !== 1 ? "s" : ""}!`,
      sub: "You're this close to hitting your daily goal.",
      bg: "bg-primary/10 dark:bg-primary/15",
      border: "border-primary/25 dark:border-primary/30",
      iconBg: "bg-primary/20 text-primary",
    };
  }

  // Priority 3: Weak cards exist and not studied yet
  if (weakCards > 0 && !studiedToday) {
    return {
      icon: <AlertTriangle className="w-4 h-4" />,
      message: `You have ${weakCards} weak card${weakCards !== 1 ? "s" : ""} — fix them today.`,
      sub: "These cards are slipping — a short review now prevents longer forgetting later.",
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-orange-200 dark:border-orange-800/50",
      iconBg: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
    };
  }

  // Priority 4: All caught up
  if (cardsDueToday === 0 && cardsStudiedToday >= DAILY_GOAL) {
    return {
      icon: <CheckCircle2 className="w-4 h-4" />,
      message: "You're all caught up — great consistency!",
      sub: "No cards due and daily goal complete. Come back tomorrow.",
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800/50",
      iconBg: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    };
  }

  return null; // No nudge — don't show anything
}

export function SmartNudge({
  currentStreak,
  studiedToday,
  weakCards,
  cardsStudiedToday,
  cardsDueToday,
  fallback,
}: SmartNudgeProps) {
  const [dismissed, setDismissed] = useState(false);
  const nudge = getNudge(currentStreak, studiedToday, weakCards, cardsStudiedToday, cardsDueToday);

  if (!nudge) {
    return <>{fallback ?? null}</>;
  }
  if (dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${nudge.bg} ${nudge.border}`}
      >
        <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${nudge.iconBg}`}>
          {nudge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{nudge.message}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{nudge.sub}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Dismiss nudge"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
