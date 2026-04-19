"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface WeakTopic {
  topic: string;
  count: number;
  deckId: string;
  deckTitle: string;
}

interface WeakAreasPanelProps {
  weakTopics: WeakTopic[];
}

const DIFFICULTY_COLOR: Record<number, string> = {
  1: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  2: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function WeakAreasPanel({ weakTopics }: WeakAreasPanelProps) {
  const router = useRouter();
  const top = weakTopics.slice(0, 3);
  const hasWeak = top.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl bg-card border border-border p-5 shadow-sm"
    >
      <div className="flex items-center gap-2.5 mb-4">
        {hasWeak ? (
          <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-lg flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
        ) : (
          <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        )}
        <div>
          <p className="text-sm font-black text-foreground">Weak Areas</p>
          <p className="text-xs text-muted-foreground">
            {hasWeak ? "Topics with the most cards still in early review" : "You're strong across all topics"}
          </p>
        </div>
      </div>

      {hasWeak ? (
        <ul className="space-y-2">
          {top.map((item, i) => (
            <motion.li
              key={`${item.deckId}-${item.topic}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <button
                onClick={() => router.push(`/study/${item.deckId}?mode=all`)}
                className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                      DIFFICULTY_COLOR[i + 1] || DIFFICULTY_COLOR[3]
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{item.topic}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.deckTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    {item.count} cards
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900/30">
          <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            All topics are well-reinforced — keep it up!
          </p>
        </div>
      )}
    </motion.div>
  );
}
