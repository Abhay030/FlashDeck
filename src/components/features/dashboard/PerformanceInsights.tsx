"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, BarChart2 } from "lucide-react";

export interface DailyAccuracy {
  date: string;   // YYYY-MM-DD
  good: number;
  total: number;
}

export interface PerformanceData {
  todayAccuracy: number | null;    // 0-100, null if no data today
  weekAccuracy: number | null;     // 7-day average, null if no data
  trend: number | null;            // diff: today - yesterday, null if no prior data
  dailyBars: DailyAccuracy[];      // last 7 days for mini chart
}

interface PerformanceInsightsProps {
  performance: PerformanceData;
}

function AccuracyBar({ value, maxValue }: { value: number; maxValue: number }) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  const color =
    pct >= 75 ? "bg-primary"
    : pct >= 50 ? "bg-primary/70"
    : "bg-primary/45";

  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-[12px]">
      <div className="w-full h-12 bg-muted rounded flex items-end overflow-hidden relative">
        <motion.div
          className={`w-full rounded-sm ${color}`}
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export function PerformanceInsights({ performance }: PerformanceInsightsProps) {
  const { todayAccuracy, weekAccuracy, trend, dailyBars } = performance;

  const hasData = todayAccuracy !== null || weekAccuracy !== null;
  const maxTotal = Math.max(...dailyBars.map((b) => b.total), 1);

  const TrendIcon =
    trend === null ? null
    : trend > 0 ? TrendingUp
    : trend < 0 ? TrendingDown
    : Minus;

  const trendColor =
    trend === null ? ""
    : trend > 0 ? "text-green-600 dark:text-green-400"
    : trend < 0 ? "text-rose-600 dark:text-rose-400"
    : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative z-0 h-full w-full min-w-0 rounded-2xl bg-card border border-border p-5 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 min-w-0">
        <div className="rounded-lg bg-primary/15 p-1.5 shrink-0">
          <BarChart2 className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            Your progress
          </p>
          <p className="text-xs text-muted-foreground truncate">
            Accuracy based on card ratings
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="py-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Start studying to see your progress here.
          </p>
        </div>
      ) : (
        <>
          {/* Accuracy stats row */}
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3 mb-5 min-w-0">
            {/* Today Accuracy */}
            <div className="min-w-0">
              <p className="text-3xl font-black text-foreground tabular-nums truncate">
                {todayAccuracy !== null ? `${todayAccuracy}%` : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Today&apos;s accuracy
              </p>
            </div>

            {/* Trend */}
            {trend !== null && TrendIcon && (
              <div
                className={`flex items-center gap-1 font-bold text-sm mb-1 flex-shrink-0 ${trendColor}`}
              >
                <TrendIcon className="w-4 h-4 flex-shrink-0" />
                <span>{trend > 0 ? "+" : ""}{trend}%</span>
                <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">
                  vs yesterday
                </span>
              </div>
            )}

            {/* Week Accuracy */}
            {weekAccuracy !== null && (
              <div className="ml-auto text-right flex-shrink-0">
                <p className="text-lg font-black text-foreground tabular-nums">
                  {weekAccuracy}%
                </p>
                <p className="text-xs text-muted-foreground">
                  7-day avg
                </p>
              </div>
            )}
          </div>

          {/* Mini bar chart */}
          {dailyBars.length > 0 && (
            <div className="flex flex-col w-full min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Last 7 days
              </p>

              <div className="flex gap-1 items-end h-14 w-full overflow-hidden min-w-0">
                {dailyBars.map((bar) => (
                  <AccuracyBar
                    key={bar.date}
                    value={bar.total}
                    maxValue={maxTotal}
                  />
                ))}
              </div>

              <div className="flex justify-between mt-1 min-w-0">
                <span className="text-[9px] text-muted-foreground truncate">
                  {new Date(dailyBars[0]?.date).toLocaleDateString("en", {
                    weekday: "short",
                  })}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  Today
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
