"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, BookOpen, RefreshCw, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import type { SessionMode } from "./StudyController";

interface StudyCompletionProps {
  totalCards: number;
  totalDeckCards?: number;
  deckId?: string;
  sessionMode?: SessionMode;
  ratingSummary?: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

export function StudyCompletion({
  totalCards,
  totalDeckCards = 1,
  deckId,
  sessionMode = "due",
  ratingSummary = { again: 0, hard: 0, good: 0, easy: 0 },
}: StudyCompletionProps) {
  const router = useRouter();

  const positive = ratingSummary.good + ratingSummary.easy;
  const struggle = ratingSummary.again + ratingSummary.hard;
  const accuracyPct =
    totalCards > 0 ? Math.round((positive / totalCards) * 100) : null;

  useEffect(() => {
    if (totalCards === 0) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
      colors: ["#FBBB3B", "#6366f1", "#a78bfa", "#c4b5fd", "#ffffff"],
      gravity: 1.2,
      scalar: 0.9,
    });
  }, [totalCards]);

  const modeLine =
    sessionMode === "all"
      ? "Session: all cards in this deck."
      : sessionMode === "weak"
      ? "Session: weak cards only."
      : "Session: due cards only.";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        {totalDeckCards === 0 ? (
          <div className="rounded-full bg-destructive/10 p-5">
            <BookOpen className="h-14 w-14 text-destructive" />
          </div>
        ) : totalCards === 0 ? (
          <div className="rounded-full bg-primary/10 p-5">
            <BookOpen className="h-14 w-14 text-primary" />
          </div>
        ) : (
          <div className="rounded-full bg-green-500/10 p-5">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
          </div>
        )}
      </motion.div>

      <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-5xl">
        {totalDeckCards === 0
          ? "This deck is empty"
          : totalCards === 0
          ? "You're all caught up"
          : "Session complete"}
      </h1>

      <p className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
        {totalDeckCards === 0 ? (
          "You don't have any flashcards in this deck. Add cards manually or generate a new deck."
        ) : totalCards === 0 ? (
          "No cards matched this session — try another mode or check back later."
        ) : (
          <>
            You reviewed{" "}
            <span className="font-semibold text-foreground">
              {totalCards} card{totalCards !== 1 ? "s" : ""}
            </span>
            . Consistency compounds.
          </>
        )}
      </p>

      {totalCards > 0 && (
        <div className="mb-10 w-full max-w-md rounded-2xl border border-border/80 bg-card/60 p-5 text-left shadow-sm">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Session summary
          </p>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <span className="font-semibold">{positive}</span> rated Good / Easy
                {struggle > 0 && (
                  <>
                    {" "}
                    · <span className="font-semibold">{struggle}</span> Again / Hard (they&apos;ll come back
                    sooner)
                  </>
                )}
              </span>
            </li>
            {accuracyPct !== null && (
              <li>
                Rough accuracy (good+easy / total):{" "}
                <span className="font-semibold tabular-nums">{accuracyPct}%</span>
              </li>
            )}
            <li className="text-muted-foreground">{modeLine}</li>
            <li className="text-muted-foreground">
              Come back when cards are due — the dashboard shows what&apos;s next.
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/dashboard">
          <Button size="lg" variant="outline" className="min-w-[160px] gap-2">
            <Home className="h-4 w-4" /> Dashboard
          </Button>
        </Link>
        {deckId && totalCards > 0 && (
          <Button size="lg" className="min-w-[160px] gap-2" onClick={() => router.refresh()}>
            <RefreshCw className="h-4 w-4" /> Study again
          </Button>
        )}
      </div>
    </motion.div>
  );
}
