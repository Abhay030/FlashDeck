"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CheckCircle2, AlertTriangle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import confetti from "canvas-confetti";
import { DashboardStats } from "./DashboardClient";

// ─── Utility ─────────────────────────────────────────────────────────────────
function getMilestoneKey(streak: number) {
  if (streak === 3) return "streak_milestone_3";
  if (streak === 7) return "streak_milestone_7";
  if (streak === 30) return "streak_milestone_30";
  return null;
}

function hasSeen(key: string) {
  try { return localStorage.getItem(key) === "1"; } catch { return false; }
}
function markSeen(key: string) {
  try { localStorage.setItem(key, "1"); } catch { /**/ }
}

// ─── Milestone Modal ──────────────────────────────────────────────────────────
interface MilestoneModalProps {
  streak: number;
  onClose: () => void;
}

function MilestoneModal({ streak, onClose }: MilestoneModalProps) {
  useEffect(() => {
    // Confetti burst — stronger for longer streaks
    const count = streak >= 7 ? 180 : 80;
    confetti({ particleCount: count, spread: 70, origin: { y: 0.55 }, colors: ["#FBBB3B", "#FF8C00", "#FFF3D0", "#fff"] });
  }, [streak]);

  const config =
    streak >= 7
      ? {
          emoji: "🏆",
          title: `${streak} Day Streak!`,
          subtitle: "You're officially consistent — this is how real learning happens.",
          glow: "from-amber-400/30 to-orange-400/10",
          cta: "Keep Going 🔥",
        }
      : {
          emoji: "🔥",
          title: "You're building momentum!",
          subtitle: `${streak} days in a row — consistency is everything.`,
          glow: "from-primary/20 to-orange-300/10",
          cta: "Keep Going",
        };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl text-center overflow-hidden"
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background gradient glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.glow} pointer-events-none rounded-3xl`} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
          className="text-7xl mb-5 leading-none select-none"
        >
          {config.emoji}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="text-3xl font-black tracking-tight mb-3"
        >
          {config.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.26 }}
          className="text-muted-foreground font-medium leading-relaxed mb-8"
        >
          {config.subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
          <Button
            className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90"
            onClick={onClose}
          >
            {config.cta}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Flame Pulse ──────────────────────────────────────────────────────────────
function FlameIcon({ streak }: { streak: number }) {
  const size = streak >= 10 ? "w-12 h-12" : "w-9 h-9";
  const color = streak >= 10 ? "text-orange-500" : "text-primary";
  return (
    <motion.div
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
    >
      <Flame className={`${size} ${color}`} />
    </motion.div>
  );
}

// ─── Week Dots ────────────────────────────────────────────────────────────────
function WeekDots({ streak, studiedToday }: { streak: number; studiedToday: boolean }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const todayIdx = (new Date().getDay() + 6) % 7; // 0=Mon

  return (
    <div className="flex items-center gap-1.5 mt-3">
      {days.map((d, i) => {
        const isToday = i === todayIdx;
        const filled = isToday ? studiedToday : i < todayIdx && streak > (todayIdx - i);
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                filled
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isToday && !studiedToday
                  ? "border-2 border-primary/50 text-primary/50"
                  : "bg-muted/50 text-muted-foreground/50"
              }`}
            >
              {filled ? "✓" : d}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main StreakCard ──────────────────────────────────────────────────────────
interface StreakCardProps {
  stats: DashboardStats;
  studiedToday: boolean;
  /** Merges with card root; use e.g. `mb-0` when parent handles vertical rhythm */
  className?: string;
}

export function StreakCard({ stats, studiedToday, className }: StreakCardProps) {
  const { currentStreak, cardsDueToday, cardsStudiedToday } = stats;
  const [showModal, setShowModal] = useState(false);
  const checked = useRef(false);

  // Milestone modal — fires once per milestone using localStorage
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    const key = getMilestoneKey(currentStreak);
    if (key && !hasSeen(key)) {
      markSeen(key);
      setShowModal(true);
    }
  }, [currentStreak]);

  // ── CASE 1: New user — no activity ever ───────────────────────────────────
  if (currentStreak === 0 && cardsStudiedToday === 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className={cn(
            "w-full bg-gradient-to-br from-primary/10 to-amber-400/5 border border-primary/20 rounded-2xl p-7 mb-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300",
            className
          )}
        >
          <div className="absolute inset-0 bg-warm-dots opacity-20 pointer-events-none" />
          <div className="text-6xl select-none flex-shrink-0">🔥</div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-black tracking-tight mb-1">Start your learning streak today</h2>
            <p className="text-muted-foreground font-medium">
              Just 5 minutes a day can change everything. Your first card is the hardest.
            </p>
          </div>
          {cardsDueToday > 0 ? (
            <Link href={`/study`} className="flex-shrink-0 w-full sm:w-auto">
              <Button className="w-full sm:w-auto font-bold px-8 h-11">Start Studying 🚀</Button>
            </Link>
          ) : (
            <Link href="/" className="flex-shrink-0 w-full sm:w-auto">
              <Button className="w-full sm:w-auto font-bold px-8 h-11">Upload a PDF</Button>
            </Link>
          )}
        </motion.div>
      </>
    );
  }

  // ── CASE: Studied today already ───────────────────────────────────────────
  if (studiedToday && cardsDueToday === 0) {
    return (
      <>
        <AnimatePresence>{showModal && <MilestoneModal streak={currentStreak} onClose={() => setShowModal(false)} />}</AnimatePresence>
        <StreakHeroCard streak={currentStreak} studiedToday={studiedToday} variant="done" cardsDueToday={cardsDueToday} cardsStudiedToday={cardsStudiedToday} className={className} />
      </>
    );
  }

  // ── CASE: Not studied today but streak exists → warning ───────────────────
  if (!studiedToday && currentStreak > 0) {
    return (
      <>
        <AnimatePresence>{showModal && <MilestoneModal streak={currentStreak} onClose={() => setShowModal(false)} />}</AnimatePresence>
        <StreakHeroCard streak={currentStreak} studiedToday={studiedToday} variant="at_risk" cardsDueToday={cardsDueToday} cardsStudiedToday={cardsStudiedToday} className={className} />
      </>
    );
  }

  // ── CASE: Normal active streak ────────────────────────────────────────────
  return (
    <>
      <AnimatePresence>{showModal && <MilestoneModal streak={currentStreak} onClose={() => setShowModal(false)} />}</AnimatePresence>
      <StreakHeroCard streak={currentStreak} studiedToday={studiedToday} variant="active" cardsDueToday={cardsDueToday} cardsStudiedToday={cardsStudiedToday} className={className} />
    </>
  );
}

// ─── Shared Streak Hero Card ──────────────────────────────────────────────────
interface StreakHeroCardProps {
  streak: number;
  studiedToday: boolean;
  variant: "active" | "at_risk" | "done";
  cardsDueToday: number;
  cardsStudiedToday: number;
  className?: string;
}

function StreakHeroCard({ streak, studiedToday, variant, cardsDueToday, cardsStudiedToday, className }: StreakHeroCardProps) {
  const isLong = streak >= 10;
  const dailyTotal = cardsDueToday + cardsStudiedToday;
  const progress = dailyTotal === 0 ? 100 : Math.round((cardsStudiedToday / dailyTotal) * 100);

  const variantStyles = {
    active: "bg-card border-border",
    at_risk: "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
    done: "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
  };

  const labels = {
    active: streak === 1 ? "Great start — keep going!" : streak < 7 ? "You're building momentum!" : "You're on fire 🔥",
    at_risk: "Don't lose your streak! Study at least 1 card to keep it alive.",
    done: "You're done for today — amazing work! See you tomorrow.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={cn(
        "relative w-full border rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      {/* Radial glow */}
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 ${
        variant === "done" ? "bg-green-400/10" : isLong ? "bg-orange-400/15" : "bg-primary/8"
      }`} />

      {/* Warning badge */}
      {variant === "at_risk" && (
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 bg-amber-100 dark:bg-amber-900/40 px-3 py-1.5 rounded-full w-fit border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-3.5 h-3.5" />
          Streak at risk
        </div>
      )}
      {variant === "done" && (
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-4 bg-green-100 dark:bg-green-900/40 px-3 py-1.5 rounded-full w-fit border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Goal Complete
        </div>
      )}
      {variant === "active" && isLong && (
        <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-4 bg-orange-100 dark:bg-orange-900/40 px-3 py-1.5 rounded-full w-fit border border-orange-200 dark:border-orange-800">
          <Sparkles className="w-3.5 h-3.5" />
          On fire
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
        {/* Flame + streak count */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <FlameIcon streak={streak} />
          <div>
            <div className={`font-black tracking-tight leading-none ${isLong ? "text-5xl" : "text-4xl"}`}>
              {streak}
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
              Day Streak
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-14 bg-border flex-shrink-0" />

        {/* Label + week dots */}
        <div className="flex-1">
          <p className="font-semibold text-base text-foreground/90">{labels[variant]}</p>
          <WeekDots streak={streak} studiedToday={studiedToday} />
        </div>

        {/* Progress + CTA */}
        <div className="w-full sm:w-60 flex-shrink-0">
          {dailyTotal > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs font-bold mb-1.5 text-muted-foreground">
                <span>{cardsStudiedToday} / {dailyTotal} reviewed</span>
                <span>{progress}%</span>
              </div>
              <Progress
                value={progress}
                className={`h-2.5 ${variant === "done" ? "[&>div]:bg-green-500" : ""}`}
              />
            </div>
          )}
          {variant === "at_risk" && cardsDueToday > 0 && (
            <Link href="#decks">
              <Button className="w-full font-bold h-10 bg-amber-500 hover:bg-amber-600 text-white">
                Study Now 🔥
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
