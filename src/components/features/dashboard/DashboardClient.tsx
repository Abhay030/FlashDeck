"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Sparkles } from "lucide-react";
import { StatCards } from "./StatCards";
import { DeckGrid } from "./DeckGrid";
import { StreakCard } from "./StreakCard";
import { ProductivityLayer } from "./ProductivityLayer";
import { DailyGoal } from "./DailyGoal";
import { WeakAreasPanel } from "./WeakAreasPanel";
import { ResumeSession } from "./ResumeSession";
import { ExpandDeckCard } from "./ExpandDeckCard";
import { SmartNudge } from "./SmartNudge";
import { PerformanceInsights } from "./PerformanceInsights";
import { MicroAchievements } from "./MicroAchievements";
import { DashboardSection } from "./DashboardSection";
import { DashboardTabNav, type DashboardTabId } from "./DashboardTabNav";
import { WeeklyRecapCard, type WeeklyRecapData } from "./WeeklyRecapCard";
import type { WeakTopic } from "./WeakAreasPanel";
import type { LastSession } from "./ResumeSession";
import type { PerformanceData } from "./PerformanceInsights";
import type { AchievementTriggers } from "./MicroAchievements";

const ActivityHeatmap = dynamic(
  () => import("./ActivityHeatmap").then((m) => ({ default: m.ActivityHeatmap })),
  { ssr: false, loading: () => <div className="h-10 w-full rounded-md bg-muted/20 animate-pulse" /> }
);

export interface ProcessedDeck {
  _id: string;
  title: string;
  createdAt: string | Date;
  totalCardsCount: number;
  dueCardsCount: number;
  masteredCardsCount: number;
  weakCardsCount: number;
}

export interface DashboardStats {
  totalDecks: number;
  totalCards: number;
  cardsMastered: number;
  cardsDueToday: number;
  weakCards: number;
  cardsStudiedToday: number;
  currentStreak: number;
}

interface DashboardClientProps {
  decks: ProcessedDeck[];
  stats: DashboardStats;
  heatmapData: { date: string; count: number }[];
  studiedToday: boolean;
  priorityDeck: ProcessedDeck | null;
  weakTopics: WeakTopic[];
  lastSession: LastSession | null;
  performanceData: PerformanceData;
  achievementTriggers: AchievementTriggers;
  weeklyRecap: WeeklyRecapData;
}

export function DashboardClient({
  decks: initialDecks,
  stats,
  heatmapData,
  studiedToday,
  priorityDeck,
  weakTopics,
  lastSession,
  performanceData,
  achievementTriggers,
  weeklyRecap,
}: DashboardClientProps) {
  const [decks, setDecks] = useState(initialDecks);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "alphabetical" | "mostDue">("recent");
  const [tab, setTab] = useState<DashboardTabId>("study");
  const [insightsMore, setInsightsMore] = useState(false);

  const handleTabChange = useCallback((id: DashboardTabId) => {
    setTab(id);
    if (typeof window === "undefined") return;
    const base = `${window.location.pathname}${window.location.search}`;
    if (id === "library") {
      window.history.replaceState(null, "", `${base}#decks`);
    } else {
      window.history.replaceState(null, "", base);
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash === "#decks") {
        setTab("library");
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getSubGreeting = () => {
    if (stats.currentStreak > 0) {
      return `${stats.currentStreak}-day streak — keep the rhythm going.`;
    }
    if (stats.cardsDueToday === 0) return "You're caught up. Nice work.";
    return `${stats.cardsDueToday} card${stats.cardsDueToday !== 1 ? "s" : ""} ready for review.`;
  };

  const handleDelete = (deletedId: string) => {
    setDecks((prev) => prev.filter((d) => d._id !== deletedId));
  };

  const currentDecks = useMemo(() => {
    let filtered = [...decks];

    if (searchQuery) {
      filtered = filtered.filter((deck) =>
        deck.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
      if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "mostDue") return b.dueCardsCount - a.dueCardsCount;
      return 0;
    });

    return filtered;
  }, [decks, searchQuery, sortBy]);

  const nudgeFallback = (
    <div className="rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
      You&apos;re on track today — no urgent nudges.
    </div>
  );

  const expandDeckSummaries = decks.map((d) => ({
    _id: d._id,
    title: d.title,
    totalCardsCount: d.totalCardsCount,
  }));

  return (
    <MaxWidthWrapper className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
        <header className="flex flex-col gap-5 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {getGreeting()}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {getSubGreeting()}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => window.dispatchEvent(new Event("open-upload-modal"))}
            className="h-10 shrink-0 gap-2 px-5 font-semibold shadow-sm"
          >
            <PlusCircle className="h-4 w-4" /> New deck
          </Button>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground md:text-sm">
            Jump between daily study, analytics, and your library.
          </p>
          <DashboardTabNav active={tab} onChange={handleTabChange} />
        </div>

        <AnimatePresence mode="wait">
          {tab === "study" && (
            <motion.div
              key="study"
              role="tabpanel"
              id="panel-study"
              aria-labelledby="tab-study"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-10 md:space-y-12"
            >
              <DashboardSection
                eyebrow="Overview"
                title="At a glance"
                description="Numbers across every deck — due cards, mastery, and today’s study volume."
              >
                <StatCards stats={stats} />
              </DashboardSection>

              <WeeklyRecapCard data={weeklyRecap} />

              <DashboardSection
                eyebrow="Focus"
                title="What to do next"
                description="We pick the highest-impact deck — due first, then weak areas, then recency."
              >
                <ProductivityLayer decks={decks} priorityDeck={priorityDeck} />
              </DashboardSection>

              <DashboardSection
                eyebrow="Momentum"
                title="Streak & nudges"
                description="Short feedback loops help habits stick — dismiss nudges anytime."
              >
                <div className="space-y-4">
                  <StreakCard stats={stats} studiedToday={studiedToday} className="mb-0" />
                  <SmartNudge
                    currentStreak={stats.currentStreak}
                    studiedToday={studiedToday}
                    weakCards={stats.weakCards}
                    cardsStudiedToday={stats.cardsStudiedToday}
                    cardsDueToday={stats.cardsDueToday}
                    fallback={nudgeFallback}
                  />
                </div>
              </DashboardSection>

              <DashboardSection
                eyebrow="Insights"
                title="Resume & weak areas"
                description="Pick up where you left off and see topics that need reinforcement."
              >
                <div className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-5">
                  <ResumeSession lastSession={lastSession} />
                  <WeakAreasPanel weakTopics={weakTopics} />
                </div>
              </DashboardSection>

              <DashboardSection
                eyebrow="Today"
                title="Goals & accuracy"
                description="Daily goal progress and how your ratings trend over the last week."
              >
                <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 md:items-start">
                  <div className="min-w-0">
                    <DailyGoal cardsStudiedToday={stats.cardsStudiedToday} />
                  </div>
                  <div className="min-w-0">
                    <PerformanceInsights performance={performanceData} />
                  </div>
                </div>
              </DashboardSection>
            </motion.div>
          )}

          {tab === "insights" && (
            <motion.div
              key="insights"
              role="tabpanel"
              id="panel-insights"
              aria-labelledby="tab-insights"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-10 md:space-y-12"
            >
              <DashboardSection
                eyebrow="Insights"
                title="Long-term activity & growth"
                description="Optional tools: expand decks from your PDF and review 60-day consistency. Hidden by default to keep the main view calm."
              >
                <div className="rounded-2xl border border-border/80 bg-muted/15 p-6 sm:p-8">
                  <div className="mx-auto max-w-lg text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Open this section when you want to generate more cards or inspect your study history
                      heatmap — same data as before, just tucked away for focus.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-5 font-semibold"
                      onClick={() => setInsightsMore((v) => !v)}
                      aria-expanded={insightsMore}
                    >
                      {insightsMore ? "Show less" : "Show more"}
                    </Button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {insightsMore && (
                    <motion.div
                      key="insights-expanded"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-10 pt-4">
                        {decks.length > 0 && (
                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              Add more cards
                            </p>
                            <ExpandDeckCard decks={expandDeckSummaries} />
                          </div>
                        )}
                        <div>
                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Study activity
                          </p>
                          <ActivityHeatmap heatmapData={heatmapData} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </DashboardSection>
            </motion.div>
          )}

          {tab === "library" && (
            <motion.div
              key="library"
              role="tabpanel"
              id="panel-library"
              aria-labelledby="tab-library"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardSection
                id="decks"
                eyebrow="Library"
                title={`Your decks (${decks.length})`}
                description="Search, sort, and jump into study mode."
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <div className="relative w-full sm:max-w-[260px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search decks…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-border bg-muted/20 py-2 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <select
                    className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm outline-none focus:border-primary sm:w-auto"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  >
                    <option value="recent">Most recent</option>
                    <option value="mostDue">Most due</option>
                    <option value="alphabetical">A–Z</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>

                {decks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 py-20 text-center">
                    <div className="mb-4 text-5xl">📚</div>
                    <h3 className="mb-2 text-xl font-semibold">No decks yet</h3>
                    <p className="mx-auto mb-6 max-w-xs text-muted-foreground">
                      Upload a PDF to generate your first flashcard deck.
                    </p>
                    <Button
                      className="gap-2 font-semibold"
                      onClick={() => window.dispatchEvent(new Event("open-upload-modal"))}
                    >
                      <PlusCircle className="h-4 w-4" /> Upload PDF
                    </Button>
                  </div>
                ) : currentDecks.length === 0 && searchQuery ? (
                  <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 py-16 text-center">
                    <div className="mb-3 text-4xl">🔍</div>
                    <h3 className="mb-2 text-lg font-semibold">No decks match &ldquo;{searchQuery}&rdquo;</h3>
                    <p className="mb-4 text-sm text-muted-foreground">Try another search or clear the filter.</p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <DeckGrid decks={currentDecks} onDelete={handleDelete} />
                )}
              </DashboardSection>
            </motion.div>
          )}
        </AnimatePresence>

        <MicroAchievements triggers={achievementTriggers} />
      </div>
    </MaxWidthWrapper>
  );
}
