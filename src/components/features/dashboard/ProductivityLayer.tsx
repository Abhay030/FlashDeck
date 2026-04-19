"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Target, ArrowRight, BookOpen, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ProcessedDeck } from "./DashboardClient";

interface ProductivityLayerProps {
  decks: ProcessedDeck[];
  priorityDeck: ProcessedDeck | null;
}

export function ProductivityLayer({ decks, priorityDeck }: ProductivityLayerProps) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const allCaughtUp =
    decks.length > 0 &&
    decks.every((d) => d.dueCardsCount === 0 && d.weakCardsCount === 0);
  const noDecks = decks.length === 0;
  const totalDue = decks.reduce((s, d) => s + d.dueCardsCount, 0);

  const handleStartStudying = () => {
    if (navigating) return;

    if (noDecks) {
      window.dispatchEvent(new Event("open-upload-modal"));
      return;
    }
    if (!priorityDeck) return;

    setNavigating(true);
    const query = priorityDeck.dueCardsCount > 0 ? "" : "?mode=all";
    router.push(`/study/${priorityDeck._id}${query}`);
  };

  const ctaSubtext = noDecks
    ? "Upload a PDF — AI generates your flashcards in seconds."
    : allCaughtUp
    ? "All caught up! Keep sharp by revisiting everything."
    : `${totalDue} card${totalDue !== 1 ? "s" : ""} due across ${decks.filter((d) => d.dueCardsCount > 0).length} deck${decks.filter((d) => d.dueCardsCount > 0).length !== 1 ? "s" : ""}.`;

  const ctaLabel = noDecks
    ? "Upload Your First PDF"
    : allCaughtUp
    ? "Review Everything"
    : "Start Studying";

  const deckSubtitle = priorityDeck
    ? priorityDeck.dueCardsCount > 0
      ? `${priorityDeck.dueCardsCount} card${priorityDeck.dueCardsCount !== 1 ? "s" : ""} due for review`
      : priorityDeck.weakCardsCount > 0
      ? `${priorityDeck.weakCardsCount} weak card${priorityDeck.weakCardsCount !== 1 ? "s" : ""} to reinforce`
      : `${priorityDeck.totalCardsCount} cards — review to stay sharp`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="grid sm:grid-cols-2 gap-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-primary/10 p-6 shadow-sm dark:bg-primary/15 flex flex-col justify-between gap-4">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl dark:bg-primary/20"
          aria-hidden
        />

        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary/90">
            Quick action
          </p>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
            {allCaughtUp ? "All caught up" : noDecks ? "Let's get started" : "Ready to study?"}
          </h2>
          <p className="mt-1.5 text-sm font-medium leading-snug text-muted-foreground">
            {ctaSubtext}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Button
            onClick={handleStartStudying}
            disabled={navigating}
            className="h-11 self-start gap-2 rounded-xl px-6 font-semibold shadow-md transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {navigating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                {ctaLabel}
              </>
            )}
          </Button>
          {!noDecks && !allCaughtUp && (
            <p className="pl-1 text-[11px] font-medium text-muted-foreground">
              Uses the highest-priority deck automatically.
            </p>
          )}
        </div>
      </div>

      {priorityDeck ? (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="group flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-lg bg-primary/15 p-1.5 text-primary">
                <Target className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Focus next
              </span>
              {allCaughtUp && (
                <span className="ml-auto flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                  <CheckCheck className="h-3 w-3" /> All done
                </span>
              )}
            </div>
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-foreground">
              {priorityDeck.title}
            </h3>
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{deckSubtitle}</span>
            </div>
          </div>

          <Button
            onClick={() => {
              if (navigating) return;
              setNavigating(true);
              const query = priorityDeck.dueCardsCount > 0 ? "" : "?mode=all";
              router.push(`/study/${priorityDeck._id}${query}`);
            }}
            disabled={navigating}
            variant="outline"
            className="h-10 self-start gap-2 rounded-xl border-primary/35 px-5 font-semibold text-foreground hover:bg-primary/10 hover:text-foreground dark:hover:bg-primary/15"
          >
            {navigating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Start review
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Upload your first PDF to see your focus deck here.
          </p>
        </div>
      )}
    </motion.div>
  );
}
