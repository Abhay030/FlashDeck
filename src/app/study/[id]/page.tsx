import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import { Deck, IDeck, ICard } from "@/models/Deck";
import { StudyLog } from "@/models/StudyLog";
import { StudyController } from "@/components/features/study/StudyController";

export const dynamic = "force-dynamic";

interface StudyPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function isWeakCard(card: { interval?: number; repetition?: number }) {
  return (card.interval ?? 0) < 2 || (card.repetition ?? 0) < 2;
}

export default async function StudyPage({ params, searchParams }: StudyPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const modeRaw = typeof resolvedSearchParams.mode === "string" ? resolvedSearchParams.mode : undefined;
  const isStudyAllMode = modeRaw === "all";
  const isStudyWeakMode = modeRaw === "weak";
  const sessionMode: "due" | "all" | "weak" = isStudyAllMode ? "all" : isStudyWeakMode ? "weak" : "due";

  if (!resolvedParams.id || resolvedParams.id.length !== 24) {
    notFound();
  }

  await connectToDatabase();

  const deck = await Deck.findById(resolvedParams.id).select("title cards").lean() as unknown as IDeck;

  if (!deck || !deck.cards) {
    notFound();
  }

  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const studiedTodayBeforeSession = await StudyLog.countDocuments({
    timestamp: { $gte: startOfToday },
  });

  const sanitizedCards = deck.cards
    .filter((card: any) => {
      if (isStudyAllMode) return true;
      if (isStudyWeakMode) return isWeakCard(card);
      if (!card.dueDate) return true;
      return new Date(card.dueDate) <= now;
    })
    .map((card: any) => ({
      _id: card._id ? card._id.toString() : Math.random().toString(),
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      topic: card.topic,
      interval: card.interval ?? 0,
      repetition: card.repetition ?? 0,
      eFactor: card.eFactor ?? 2.5,
      dueDate: card.dueDate ? new Date(card.dueDate).toISOString() : new Date().toISOString(),
    })) as unknown as ICard[];

  return (
    <main className="min-h-screen bg-background bg-warm-dots relative isolate">
      <StudyController
        cards={sanitizedCards}
        totalDeckCards={deck.cards?.length || 0}
        deckTitle={deck.title}
        deckId={resolvedParams.id}
        sessionMode={sessionMode}
        studiedTodayBeforeSession={studiedTodayBeforeSession}
      />
    </main>
  );
}
