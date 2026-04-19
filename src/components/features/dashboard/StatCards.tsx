"use client";

import { useEffect, useState, useRef } from "react";
import { motion, animate, AnimatePresence } from "framer-motion";
import { Library, CalendarClock, Medal, Zap, BrainCircuit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DashboardStats } from "./DashboardClient";

function AnimatedCounter({ value }: { value: number }) {
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setCurrentValue(Math.round(v)),
    });
    return controls.stop;
  }, [value]);
  return <span>{currentValue}</span>;
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      title: "Active Decks",
      value: stats.totalDecks,
      icon: Library,
      tooltip: "Total number of flashcard decks you have created from uploaded PDFs.",
      color: "blue"
    },
    {
      title: "Cards Due Today",
      value: stats.cardsDueToday,
      icon: CalendarClock,
      tooltip: "Cards whose SM-2 review date has arrived. Studying these is your top priority for long-term retention.",
      color: "amber"
    },
    {
      title: "Mastered Concepts",
      value: stats.cardsMastered,
      icon: Medal,
      tooltip: "Cards with an Easiness Factor ≥ 2.6 — meaning you consistently recalled them correctly and they are well-learned.",
      color: "green"
    },
    {
      title: "Studied Today",
      value: stats.cardsStudiedToday || 0,
      icon: Zap,
      tooltip: "Cards you reviewed in today's session(s), logged in real-time from your activity history.",
      color: "purple"
    },
    {
      title: "Weak Cards",
      value: stats.weakCards,
      icon: BrainCircuit,
      tooltip: "Cards with fewer than 2 successful repetitions or a very short review interval. Focus here to improve.",
      color: "red"
    },
  ];

  const getColorClasses = (color: string, value: number) => {
    const isZero = value === 0;

    switch (color) {
      case "blue":
        return {
          card: isZero ? "bg-blue-500/5 hover:bg-blue-500/[0.07] border-blue-500/10 hover:border-blue-500/20" : "bg-blue-500/10 hover:bg-blue-500/[0.15] border-blue-500/20 hover:border-blue-500/30",
          text: isZero ? "text-muted-foreground" : "text-blue-900/70 dark:text-blue-400/80",
          iconContainer: isZero ? "bg-blue-500/10 text-blue-500/50" : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
        };
      case "amber":
        return {
          card: isZero ? "bg-amber-500/5 hover:bg-amber-500/[0.07] border-amber-500/10 hover:border-amber-500/20" : "bg-amber-500/10 hover:bg-amber-500/[0.15] border-amber-500/20 hover:border-amber-500/30",
          text: isZero ? "text-muted-foreground" : "text-amber-900/70 dark:text-amber-400/80",
          iconContainer: isZero ? "bg-amber-500/10 text-amber-500/50" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
        };
      case "green":
        return {
          card: isZero ? "bg-green-500/5 hover:bg-green-500/[0.07] border-green-500/10 hover:border-green-500/20" : "bg-green-500/10 hover:bg-green-500/[0.15] border-green-500/20 hover:border-green-500/30",
          text: isZero ? "text-muted-foreground" : "text-green-900/70 dark:text-green-400/80",
          iconContainer: isZero ? "bg-green-500/10 text-green-500/50" : "bg-green-500/20 text-green-600 dark:text-green-400"
        };
      case "purple":
        return {
          card: isZero ? "bg-purple-500/5 hover:bg-purple-500/[0.07] border-purple-500/10 hover:border-purple-500/20" : "bg-purple-500/10 hover:bg-purple-500/[0.15] border-purple-500/20 hover:border-purple-500/30",
          text: isZero ? "text-muted-foreground" : "text-purple-900/70 dark:text-purple-400/80",
          iconContainer: isZero ? "bg-purple-500/10 text-purple-500/50" : "bg-purple-500/20 text-purple-600 dark:text-purple-400"
        };
      case "red":
        return {
          card: isZero ? "bg-red-500/5 hover:bg-red-500/[0.07] border-red-500/10 hover:border-red-500/20" : "bg-red-500/10 hover:bg-red-500/[0.15] border-red-500/20 hover:border-red-500/30",
          text: isZero ? "text-muted-foreground" : "text-red-900/70 dark:text-red-400/80",
          iconContainer: isZero ? "bg-red-500/10 text-red-500/50" : "bg-red-500/20 text-red-600 dark:text-red-400"
        };
      default:
        return {
          card: "bg-card border-border",
          text: "text-muted-foreground",
          iconContainer: "bg-muted/40"
        };
    }
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 w-full">
        {cards.map((stat, i) => {
          const colors = getColorClasses(stat.color, stat.value);
          const Icon = stat.icon;

          return (
            <Tooltip key={i}>
              <TooltipTrigger className="text-left w-full hover:outline-none focus:outline-none appearance-none bg-transparent border-none p-0 cursor-help">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                    className={cn(
                      "p-4 sm:p-5 border rounded-xl flex flex-col justify-between transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-md cursor-help h-full w-full",
                      colors.card
                    )}
                  >
                    <div className="flex items-start justify-between mb-3 w-full">
                      <div className="flex items-center gap-1.5 flex-1">
                        <h3 className={cn(
                          "font-medium text-[11px] sm:text-xs uppercase tracking-widest leading-tight",
                          colors.text
                        )}>
                          {stat.title}
                        </h3>
                      </div>
                      <div className={cn("p-1.5 rounded-md flex-shrink-0 transition-colors", colors.iconContainer)}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className={cn(
                        "text-4xl sm:text-5xl font-bold tracking-tight",
                        stat.value === 0 ? "text-muted-foreground/80 font-medium" : "text-foreground"
                      )}>
                        <AnimatedCounter value={stat.value} />
                      </p>
                    </div>
                  </motion.div>
              </TooltipTrigger>
              <TooltipContent sideOffset={8} className="max-w-[200px] text-xs leading-relaxed font-medium">
                {stat.tooltip}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
