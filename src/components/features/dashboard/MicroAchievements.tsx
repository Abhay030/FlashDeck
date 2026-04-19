"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "flashdeck_achievements_seen";
const DAILY_GOAL = 10;

export interface AchievementTriggers {
  totalStudied: number;         // all-time StudyLog count
  currentStreak: number;
  cardsStudiedToday: number;
  isFirstSession: boolean;      // true if totalStudied was 0 before today
  /** StudyLog reviews in the last 7 days (dashboard aggregate) */
  weeklyReviews7d?: number;
}

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  sub: string;
}

function computeEarned(triggers: AchievementTriggers): Achievement[] {
  const earned: Achievement[] = [];

  if (triggers.isFirstSession) {
    earned.push({ id: "first_session", emoji: "🚀", title: "First Session!", sub: "You've started your learning journey." });
  }
  if (triggers.currentStreak >= 3) {
    earned.push({ id: `streak_3`, emoji: "🔥", title: "3-Day Streak", sub: "Three days of consistent study — keep it up!" });
  }
  if (triggers.currentStreak >= 7) {
    earned.push({ id: `streak_7`, emoji: "🏆", title: "7-Day Streak", sub: "A full week of daily studying. Incredible." });
  }
  if (triggers.cardsStudiedToday >= DAILY_GOAL) {
    earned.push({ id: "daily_goal_done", emoji: "🎯", title: "Daily Goal Hit!", sub: "You completed your daily study goal." });
  }
  if (triggers.totalStudied >= 50) {
    earned.push({ id: "milestone_50", emoji: "⭐", title: "50 Cards Studied", sub: "You've reviewed 50 cards total — serious work!" });
  }
  if ((triggers.weeklyReviews7d ?? 0) >= 25) {
    earned.push({
      id: "week_volume_25",
      emoji: "📈",
      title: "Big Study Week",
      sub: "25+ reviews in the last 7 days — you're building real volume.",
    });
  }

  return earned;
}

function getSeenSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markSeen(id: string) {
  try {
    const seen = getSeenSet();
    seen.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
  } catch {}
}

export function MicroAchievements({ triggers }: { triggers: AchievementTriggers }) {
  const [queue, setQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    const earned = computeEarned(triggers);
    const seen = getSeenSet();
    const unseen = earned.filter((a) => !seen.has(a.id));
    if (unseen.length > 0) setQueue(unseen);
  }, []); // intentionally run once on mount

  const dismiss = (id: string) => {
    markSeen(id);
    setQueue((prev) => prev.filter((a) => a.id !== id));
  };

  if (queue.length === 0) return null;

  // Show only the first achievement at a time (toast-style)
  const current = queue[0];

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-card border border-border rounded-2xl p-4 shadow-xl max-w-[320px] w-full"
      >
        {/* Glow accent */}
        <div className="absolute inset-0 rounded-2xl bg-primary/4 pointer-events-none" aria-hidden />

        <span className="text-2xl leading-none flex-shrink-0 mt-0.5">{current.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-foreground">{current.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{current.sub}</p>
        </div>
        <button
          onClick={() => dismiss(current.id)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 rounded-md hover:bg-muted"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
