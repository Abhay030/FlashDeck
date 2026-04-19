"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";

import { RefreshCcw, Brain, CheckCircle2, Zap } from "lucide-react";

type Rating = "again" | "hard" | "good" | "easy";

interface StudyControlsProps {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
}

const RATING_CONFIG: Record<Rating, {
  label: string;
  key: string;
  icon: any;
  hint: string;
  base: string;
  hover: string;
  active: string;
  ring: string;
}> = {
  again: {
    label: "Again",
    key: "1",
    icon: RefreshCcw,
    hint: "You forgot — this card will reappear within the next few minutes.",
    base: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    hover: "hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-md hover:shadow-red-200/50 dark:hover:shadow-red-900/30",
    active: "bg-red-100 dark:bg-red-900/60 scale-[0.97] ring-2 ring-red-400/60",
    ring: "ring-red-400/60",
  },
  hard: {
    label: "Hard",
    key: "2",
    icon: Brain,
    hint: "Recalled with effort — shown more frequently than usual over the next few days.",
    base: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    hover: "hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:shadow-md hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30",
    active: "bg-amber-100 dark:bg-amber-900/60 scale-[0.97] ring-2 ring-amber-400/60",
    ring: "ring-amber-400/60",
  },
  good: {
    label: "Good",
    key: "3",
    icon: CheckCircle2,
    hint: "Solid recall — the SM-2 algorithm will schedule this card at an optimal interval.",
    base: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    hover: "hover:bg-green-100 dark:hover:bg-green-900/50 hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/30",
    active: "bg-green-100 dark:bg-green-900/60 scale-[0.97] ring-2 ring-green-400/60",
    ring: "ring-green-400/60",
  },
  easy: {
    label: "Easy",
    key: "4",
    icon: Zap,
    hint: "Perfect recall — this card is pushed far into the future to free up your review time.",
    base: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30",
    active: "bg-blue-100 dark:bg-blue-900/60 scale-[0.97] ring-2 ring-blue-400/60",
    ring: "ring-blue-400/60",
  },
};

function GuidancePanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto mt-4 bg-card border border-border rounded-xl p-5 shadow-lg relative"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Close guidance"
      >
        <X className="w-4 h-4" />
      </button>

      <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70 mb-4">
        How rating works (SM-2 Algorithm)
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["again", "hard", "good", "easy"] as Rating[]).map((r) => {
          const cfg = RATING_CONFIG[r];
          return (
            <div key={r} className={`rounded-lg p-3 border ${cfg.base}`}>
              <div className="mb-1.5"><cfg.icon className="h-6 w-6" /></div>
              <div className="text-xs font-black uppercase tracking-wide mb-1">{cfg.label}</div>
              <p className="text-xs leading-relaxed opacity-80">{cfg.hint}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        The <strong>SuperMemo-2 (SM-2)</strong> algorithm adjusts each card's review interval
        based on your self-rating. Consistent, honest ratings lead to faster long-term retention.
      </p>
    </motion.div>
  );
}

export function StudyControls({ onRate, disabled }: StudyControlsProps) {
  const [activeRating, setActiveRating] = useState<Rating | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleRate = useCallback((rating: Rating) => {
    if (disabled || activeRating) return;
    setActiveRating(rating);
    setTimeout(() => {
      setActiveRating(null);
      onRate(rating);
    }, 320);
  }, [disabled, activeRating, onRate]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* Rating buttons row */}
      <div className="flex flex-wrap sm:flex-nowrap justify-center gap-3 sm:gap-4">
        {(["again", "hard", "good", "easy"] as Rating[]).map((rating) => {
          const cfg = RATING_CONFIG[rating];
          const isActive = activeRating === rating;

          return (
            <div key={rating} className="flex flex-col items-center gap-1.5 flex-1 min-w-[80px]">
              <motion.button
                onClick={() => handleRate(rating)}
                disabled={disabled || !!activeRating}
                whileTap={{ scale: 0.93 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
                className={`
                  w-full py-2.5 px-3 rounded-lg border-2 font-bold text-sm
                  flex items-center justify-center gap-1.5
                  transition-all duration-150 ease-out
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${cfg.base} ${cfg.hover}
                  ${isActive ? cfg.active : ""}
                `}
              >
                <span className="leading-none"><cfg.icon className="h-4 w-4" /></span>
                {cfg.label}
              </motion.button>
              <span className="text-[10px] text-muted-foreground hidden sm:block font-medium">
                Press {cfg.key}
              </span>
            </div>
          );
        })}
      </div>

      {/* SM-2 info toggle */}
      <div className="flex justify-center mt-3">
        <button
          onClick={() => setShowGuide((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <Info className="w-3.5 h-3.5" />
          How does rating affect my schedule?
        </button>
      </div>

      {/* Expandable guidance panel */}
      <AnimatePresence>
        {showGuide && <GuidancePanel onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </div>
  );
}
