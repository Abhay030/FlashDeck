"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Flame, CheckCircle2 } from "lucide-react";
import { DashboardStats } from "./DashboardClient";

export function DailyGoalCard({ stats }: { stats: DashboardStats }) {
  const dailyGoalTotal = stats.cardsDueToday + stats.cardsStudiedToday;
  const progressPercent = dailyGoalTotal === 0 ? 100 : Math.round((stats.cardsStudiedToday / dailyGoalTotal) * 100);
  
  const isComplete = stats.cardsDueToday === 0 && stats.cardsStudiedToday > 0;
  const isEmpty = dailyGoalTotal === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-card border border-border shadow-sm rounded-xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex items-center gap-5 z-10 w-full md:w-auto">
        <div className="bg-primary/10 p-4 rounded-2xl flex-shrink-0">
          {isComplete ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : (
            <Flame className="w-8 h-8 text-primary" />
          )}
        </div>
        
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {isEmpty ? "Take a break" : isComplete ? "You're all caught up!" : "🔥 Today's Goal"}
          </h2>
          <p className="text-muted-foreground mt-1 font-medium">
            {isEmpty 
              ? "No cards due today. Enjoy your time off."
              : isComplete
                ? "Perfect day. Keep this consistency rolling."
                : `You have ${stats.cardsDueToday} card${stats.cardsDueToday !== 1 ? 's' : ''} left to review.`}
          </p>
        </div>
      </div>

      {!isEmpty && (
        <div className="w-full md:w-[320px] flex-shrink-0 z-10 mt-2 md:mt-0">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className={isComplete ? "text-green-500" : "text-foreground"}>
              {stats.cardsStudiedToday} <span className="text-muted-foreground font-medium">/ {dailyGoalTotal} Reviewed</span>
            </span>
            <span className={isComplete ? "text-green-500" : "text-primary"}>{progressPercent}%</span>
          </div>
          <Progress 
            value={progressPercent} 
            className={`h-3 ${isComplete ? '[&>div]:bg-green-500' : ''}`}
          />
        </div>
      )}
    </motion.div>
  );
}
