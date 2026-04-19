"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Flashcard } from "./Flashcard";
import { StudyControls } from "./StudyControls";
import { StudyCompletion } from "./StudyCompletion";
import { EditCardModal } from "./EditCardModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ICard } from "@/models/Deck";
import { formatDueSchedule } from "@/lib/studyDisplay";
import { cn } from "@/lib/utils";

const DAILY_GOAL = 10;

export type SessionMode = "due" | "all" | "weak";

interface StudyControllerProps {
  cards: ICard[];
  totalDeckCards: number;
  deckTitle: string;
  deckId: string;
  sessionMode?: SessionMode;
  /** StudyLog count for today before this session (global, matches dashboard) */
  studiedTodayBeforeSession?: number;
}

export function StudyController({
  cards,
  totalDeckCards: initialTotal,
  deckTitle,
  deckId,
  sessionMode = "due",
  studiedTodayBeforeSession = 0,
}: StudyControllerProps) {
  const [activeCards, setActiveCards] = useState<ICard[]>(cards);
  const [totalDeckCards, setTotalDeckCards] = useState(initialTotal);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [sessionRated, setSessionRated] = useState(0);
  const [ratingSummary, setRatingSummary] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  const sessionModeLabel = useMemo(() => {
    if (sessionMode === "all") return "All cards";
    if (sessionMode === "weak") return "Weak cards";
    return "Due cards";
  }, [sessionMode]);

  const handleRate = useCallback(
    async (rating: "again" | "hard" | "good" | "easy") => {
      setIsFlipped(false);

      const targetCardId = activeCards[currentIndex]._id;

      setRatingSummary((prev) => ({
        ...prev,
        [rating]: prev[rating] + 1,
      }));
      setSessionRated((c) => c + 1);

      setTimeout(() => {
        if (currentIndex < activeCards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsComplete(true);
        }
      }, 150);

      try {
        await fetch("/api/study/rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deckId,
            cardId: targetCardId,
            rating,
          }),
        });
      } catch (error) {
        console.error("Failed to sync SM-2 rating to database", error);
      }
    },
    [currentIndex, activeCards, deckId]
  );

  const handleUpdateCard = async (newQuestion: string, newAnswer: string) => {
    const cardId = activeCards[currentIndex]._id;
    const restoredCards = [...activeCards];
    setActiveCards((prev) =>
      prev.map((c, i) =>
        i === currentIndex ? { ...c, question: newQuestion, answer: newAnswer, isEdited: true } : c
      )
    );
    toast.success("Card updated");

    try {
      const res = await fetch("/api/study/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckId, cardId, question: newQuestion, answer: newAnswer }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (e) {
      toast.error("Failed to update card. Changes reverted.");
      setActiveCards(restoredCards);
    }
  };

  const handleDeleteCard = async () => {
    const cardId = activeCards[currentIndex]._id;

    toast.success("Card deleted");
    const newCards = activeCards.filter((_, i) => i !== currentIndex);
    setActiveCards(newCards);
    setIsFlipped(false);
    setTotalDeckCards((prev) => Math.max(0, prev - 1));
    setIsDeleteConfirmOpen(false);

    if (newCards.length === 0) {
      setIsComplete(true);
    } else if (currentIndex >= newCards.length) {
      setCurrentIndex(newCards.length - 1);
    }

    try {
      await fetch(`/api/study/cards?deckId=${deckId}&cardId=${cardId}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete card", e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }

      if (isFlipped && !isComplete) {
        switch (e.key) {
          case "1":
            handleRate("again");
            break;
          case "2":
            handleRate("hard");
            break;
          case "3":
            handleRate("good");
            break;
          case "4":
            handleRate("easy");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, isComplete, handleRate]);

  const cardsLeftDisplay = activeCards.length === 0 ? 0 : activeCards.length - currentIndex;

  const effectiveDailyCount = studiedTodayBeforeSession + sessionRated;
  const dailyGoalProgress = Math.min(1, effectiveDailyCount / DAILY_GOAL);

  if (!activeCards || activeCards.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <StudyCompletion
          totalCards={0}
          totalDeckCards={totalDeckCards}
          deckId={deckId}
          sessionMode={sessionMode}
          ratingSummary={ratingSummary}
        />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <StudyCompletion
          totalCards={activeCards.length}
          totalDeckCards={totalDeckCards}
          deckId={deckId}
          sessionMode={sessionMode}
          ratingSummary={ratingSummary}
        />
      </div>
    );
  }

  const currentCard = activeCards[currentIndex];
  const progressPercent = Math.round((currentIndex / activeCards.length) * 100);
  const dueLine = formatDueSchedule(currentCard.dueDate as unknown as string);

  const inner = (
    <div
      className={cn(
        "mx-auto flex w-full max-w-4xl flex-col px-4 py-6 sm:py-12",
        focusMode && "min-h-screen"
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
            {sessionModeLabel}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold"
            onClick={() => setFocusMode((f) => !f)}
            aria-pressed={focusMode}
          >
            {focusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            {focusMode ? "Exit" : "Focus"}
          </Button>
          <div className="text-sm font-medium tracking-wide">
            <span className="text-primary">{currentIndex + 1}</span> / {activeCards.length}
          </div>
        </div>
      </div>

      <div className="mb-6 w-full sm:mb-10">
        <Progress value={progressPercent} className="h-2 w-full bg-primary/10" />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {deckTitle}
            </span>
            <p className="mt-1 text-[11px] text-muted-foreground sm:hidden">{sessionModeLabel}</p>
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="text-xs font-medium text-muted-foreground">
              {cardsLeftDisplay} card{cardsLeftDisplay !== 1 ? "s" : ""} left in this session
            </p>
            <div className="flex w-full max-w-[200px] items-center gap-2 sm:max-w-none">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Daily {Math.min(effectiveDailyCount, DAILY_GOAL)}/{DAILY_GOAL}
              </span>
              <Progress value={dailyGoalProgress * 100} className="h-1.5 flex-1 bg-muted" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center" onClick={() => !isFlipped && setIsFlipped(true)}>
        <Flashcard
          question={currentCard.question}
          answer={currentCard.answer}
          topic={currentCard.topic}
          difficulty={currentCard.difficulty}
          isFlipped={isFlipped}
          isEdited={currentCard.isEdited}
          scheduleHint={dueLine}
          onEdit={() => setIsEditModalOpen(true)}
          onDelete={() => setIsDeleteConfirmOpen(true)}
        />
      </div>

      <div
        className={`mt-8 transition-all duration-300 ${isFlipped ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <StudyControls onRate={handleRate} disabled={!isFlipped} />
      </div>

      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialQuestion={currentCard.question}
        initialAnswer={currentCard.answer}
        onSave={handleUpdateCard}
      />
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteCard}
        title="Delete Flashcard?"
        description="This card will be permanently removed from this deck. This cannot be undone."
        confirmLabel="Delete Card"
      />
    </div>
  );

  if (focusMode) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-background">
        {inner}
      </div>
    );
  }

  return inner;
}
