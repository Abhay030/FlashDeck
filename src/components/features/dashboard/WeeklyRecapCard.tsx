"use client";

import { CalendarRange, BookMarked } from "lucide-react";

export interface WeeklyRecapData {
  reviews: number;
  daysActive: number;
}

interface WeeklyRecapCardProps {
  data: WeeklyRecapData;
}

/** In-dashboard “weekly recap” strip — no email, matches StudyLog aggregates. */
export function WeeklyRecapCard({ data }: WeeklyRecapCardProps) {
  const { reviews, daysActive } = data;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm ring-1 ring-primary/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/15 p-2.5 text-primary">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Last 7 days
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Your week at a glance</h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Quick snapshot from your study history — same data that powers streaks and insights.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-6 rounded-xl border border-border/60 bg-muted/20 px-5 py-3 sm:gap-8">
          <div className="flex items-center gap-2">
            <BookMarked className="h-4 w-4 text-primary" />
            <div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">{reviews}</p>
              <p className="text-[11px] font-medium text-muted-foreground">Reviews</p>
            </div>
          </div>
          <div className="w-px bg-border" aria-hidden />
          <div>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{daysActive}</p>
            <p className="text-[11px] font-medium text-muted-foreground">Active days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
