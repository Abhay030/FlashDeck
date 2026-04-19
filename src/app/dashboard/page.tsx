import connectToDatabase from "@/lib/db";
import { Deck } from "@/models/Deck";
import { StudyLog } from "@/models/StudyLog";
import { DashboardClient, DashboardStats, ProcessedDeck } from "@/components/features/dashboard/DashboardClient";
import type { WeakTopic } from "@/components/features/dashboard/WeakAreasPanel";
import type { LastSession } from "@/components/features/dashboard/ResumeSession";
import type { PerformanceData } from "@/components/features/dashboard/PerformanceInsights";
import type { AchievementTriggers } from "@/components/features/dashboard/MicroAchievements";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    await connectToDatabase();
  } catch (e: any) {
    // Throw a plain Error so Next.js can safely pass it to the Client error boundary.
    // Mongoose error class instances cannot cross the Server→Client boundary.
    throw new Error(e?.message ?? "Could not connect to the database.");
  }

  // Fetch all decks. We use lean() to strip Mongoose objects securely for Client passing.
  const allDecks = await Deck.find().sort({ createdAt: -1 }).lean();

  const now = new Date();
  
  // Initialization of global stats
  const stats: DashboardStats = {
    totalDecks: allDecks.length,
    totalCards: 0,
    cardsMastered: 0,
    cardsDueToday: 0,
    weakCards: 0,
    cardsStudiedToday: 0,
    currentStreak: 0,
  };

  // Process data strictly on the server-side to prevent loading-spinners on UX 
  const processedDecks = allDecks.map((deck: any) => {
    let dueCardsCount = 0;
    let masteredCardsCount = 0;
    let weakCardsCount = 0;
    const cards = deck.cards || [];
    
    stats.totalCards += cards.length;

    cards.forEach((card: any) => {
      // Due Date tracking
      if (!card.dueDate || new Date(card.dueDate) <= now) {
        dueCardsCount++;
        stats.cardsDueToday++;
      }

      // Mastery tracking (eFactor > 2.6 indicates high algorithm confidence)
      if (card.eFactor >= 2.6) {
        masteredCardsCount++;
        stats.cardsMastered++;
      }

      // Weak Cards tracking (interval below 2 days or structurally failed repetitions)
      if (card.interval < 2 || card.repetition < 2) {
        stats.weakCards++;
        weakCardsCount++;
      }
    });

    return {
      _id: deck._id.toString(),
      title: deck.title,
      createdAt: deck.createdAt,
      totalCardsCount: cards.length,
      dueCardsCount,
      masteredCardsCount,
      weakCardsCount,
    };
  });

  // Native MongoDB Aggregation Pipeline for Activity Heatmap
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setUTCDate(sixtyDaysAgo.getUTCDate() - 60);

  // We group strictly by UTC string formatting to ensure standard bucket distribution
  const rawHeatmap = await StudyLog.aggregate([
    { $match: { timestamp: { $gte: sixtyDaysAgo } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } }
  ]);

  const heatmapMap = new Map(rawHeatmap.map((b: any) => [b._id, b.count]));
  
  const heatmapData = [];
  const todayStr = new Date().toISOString().split("T")[0];

  // --- STREAK CALCULATION ---
  // Count consecutive days backward. If today is inactive, but yesterday wasn't, 
  // the streak is still alive (just pending completion today).
  let calculatedStreak = 0;
  const streakCursor = new Date();
  if (heatmapMap.get(todayStr)) calculatedStreak++;
  
  streakCursor.setUTCDate(streakCursor.getUTCDate() - 1);
  while (true) {
    const key = streakCursor.toISOString().split("T")[0];
    if (heatmapMap.get(key)) {
      calculatedStreak++;
      streakCursor.setUTCDate(streakCursor.getUTCDate() - 1);
    } else {
      break;
    }
  }
  stats.currentStreak = calculatedStreak;

  // We manually build the chronological 60-day skeleton, seeding missing days mathematically.
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (59 - i));
    const dateStr = d.toISOString().split("T")[0];
    
    const count = heatmapMap.get(dateStr) || 0;
    // Serialize as ISO string — Date instances are class objects and cannot be
    // passed from Server Components to Client Components.
    heatmapData.push({ date: d.toISOString(), count });

    // Catch today's activity volume explicitly for the high-level Stats Cards
    if (dateStr === todayStr) {
      stats.cardsStudiedToday += count;
    }
  }

  // --- PRIORITY DECK COMPUTATION (Server-side, full waterfall) ---
  // 1. Highest due cards → 2. Highest weak cards → 3. Last studied → 4. Newest
  let priorityDeck: ProcessedDeck | null = null;

  if (processedDecks.length > 0) {
    // Tier 1: Due cards
    const withDue = processedDecks.filter((d: ProcessedDeck) => d.dueCardsCount > 0);
    if (withDue.length > 0) {
      priorityDeck = withDue.reduce((a: ProcessedDeck, b: ProcessedDeck) =>
        a.dueCardsCount >= b.dueCardsCount ? a : b
      );
    }

    // Tier 2: Weak cards
    if (!priorityDeck) {
      const withWeak = processedDecks.filter((d: ProcessedDeck) => d.weakCardsCount > 0);
      if (withWeak.length > 0) {
        priorityDeck = withWeak.reduce((a: ProcessedDeck, b: ProcessedDeck) =>
          a.weakCardsCount >= b.weakCardsCount ? a : b
        );
      }
    }

    // Tier 3: Most recently studied (last StudyLog entry per deck)
    if (!priorityDeck) {
      const deckIds = processedDecks.map((d: ProcessedDeck) => d._id);
      // Mongoose ObjectIds are finicky — use string match via deckId field
      const recentLogs = await StudyLog.aggregate([
        { $match: { deckId: { $in: deckIds } } },
        { $sort: { timestamp: -1 } },
        { $group: { _id: "$deckId", lastStudied: { $first: "$timestamp" } } },
      ]);
      if (recentLogs.length > 0) {
        const mostRecent = recentLogs.reduce((a: any, b: any) =>
          new Date(a.lastStudied) >= new Date(b.lastStudied) ? a : b
        );
        priorityDeck = processedDecks.find((d: ProcessedDeck) => d._id === mostRecent._id.toString()) || null;
      }
    }

    // Tier 4: Newest deck (fallback)
    if (!priorityDeck) {
      priorityDeck = processedDecks.reduce((a: ProcessedDeck, b: ProcessedDeck) =>
        new Date(a.createdAt).getTime() >= new Date(b.createdAt).getTime() ? a : b
      );
    }
  }

  // --- WEAK TOPICS AGGREGATION (Server-side: group weak cards by topic across all decks) ---
  const topicMap = new Map<string, { count: number; deckId: string; deckTitle: string }>();

  allDecks.forEach((deck: any) => {
    const deckId = deck._id.toString();
    const deckTitle = deck.title as string;
    (deck.cards || []).forEach((card: any) => {
      if (card.interval < 2 || card.repetition < 2) {
        const topic = (card.topic as string) || "General";
        const existing = topicMap.get(topic);
        if (existing) {
          existing.count++;
        } else {
          topicMap.set(topic, { count: 1, deckId, deckTitle });
        }
      }
    });
  });

  const weakTopics: WeakTopic[] = Array.from(topicMap.entries())
    .map(([topic, data]) => ({ topic, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // --- LAST SESSION (latest StudyLog entry, any deck) ---
  let lastSession: LastSession | null = null;
  const latestLog = await StudyLog.findOne().sort({ timestamp: -1 }).lean() as any;
  if (latestLog) {
    const matchedDeck = processedDecks.find(
      (d: ProcessedDeck) => d._id === latestLog.deckId.toString()
    );
    if (matchedDeck) {
      lastSession = {
        deckId: matchedDeck._id,
        deckTitle: matchedDeck.title,
        timestamp: latestLog.timestamp.toISOString(),
      };
    }
  }

  // True if user has at least one study log entry today
  const studiedToday = (heatmapMap.get(todayStr) || 0) > 0;

  // --- PERFORMANCE INSIGHTS: accuracy per day, last 8 days ---
  const eightDaysAgo = new Date();
  eightDaysAgo.setUTCDate(eightDaysAgo.getUTCDate() - 7);

  const rawAccuracy = await StudyLog.aggregate([
    { $match: { timestamp: { $gte: eightDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        good: { $sum: { $cond: [{ $in: ["$rating", ["good", "easy"]] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const accMap = new Map(rawAccuracy.map((r: any) => [r._id as string, r]));

  // Build 7-day skeleton
  const dailyBars = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().split("T")[0];
    const row = accMap.get(key) as any;
    dailyBars.push({ date: key, good: row?.good ?? 0, total: row?.total ?? 0 });
  }

  const todayBar = dailyBars[dailyBars.length - 1];
  const yesterdayBar = dailyBars[dailyBars.length - 2];

  const todayAccuracy = todayBar.total > 0
    ? Math.round((todayBar.good / todayBar.total) * 100)
    : null;

  const yesterdayAccuracy = yesterdayBar.total > 0
    ? Math.round((yesterdayBar.good / yesterdayBar.total) * 100)
    : null;

  const weekBars = dailyBars.filter((b) => b.total > 0);
  const weekAccuracy = weekBars.length > 0
    ? Math.round(weekBars.reduce((s, b) => s + (b.good / b.total) * 100, 0) / weekBars.length)
    : null;

  const trend =
    todayAccuracy !== null && yesterdayAccuracy !== null
      ? todayAccuracy - yesterdayAccuracy
      : null;

  const performanceData: PerformanceData = {
    todayAccuracy,
    weekAccuracy,
    trend,
    dailyBars,
  };

  // --- Weekly recap (last 7 days, StudyLog) ---
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

  const weeklyReviews = await StudyLog.countDocuments({
    timestamp: { $gte: sevenDaysAgo },
  });

  const activeDaysAgg = await StudyLog.aggregate([
    { $match: { timestamp: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
      },
    },
    { $count: "days" },
  ]);
  const weeklyRecap = {
    reviews: weeklyReviews,
    daysActive: (activeDaysAgg[0] as { days?: number } | undefined)?.days ?? 0,
  };

  // --- ACHIEVEMENT TRIGGERS ---
  const totalStudied = await StudyLog.countDocuments();
  const studiedBeforeToday = totalStudied - (stats.cardsStudiedToday || 0);

  const achievementTriggers: AchievementTriggers = {
    totalStudied,
    currentStreak: stats.currentStreak,
    cardsStudiedToday: stats.cardsStudiedToday,
    isFirstSession: studiedBeforeToday === 0 && stats.cardsStudiedToday > 0,
    weeklyReviews7d: weeklyReviews,
  };

  return (
    <div className="min-h-screen bg-background relative z-0">
      <div className="absolute inset-0 -z-10 bg-warm-dots opacity-60" aria-hidden />
      <DashboardClient
        decks={processedDecks}
        stats={stats}
        heatmapData={heatmapData}
        studiedToday={studiedToday}
        priorityDeck={priorityDeck}
        weakTopics={weakTopics}
        lastSession={lastSession}
        performanceData={performanceData}
        achievementTriggers={achievementTriggers}
        weeklyRecap={weeklyRecap}
      />
    </div>
  );
}
