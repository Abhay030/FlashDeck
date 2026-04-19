"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface LastSession {
  deckId: string;
  deckTitle: string;
  timestamp: string; // ISO string
}

interface ResumeSessionProps {
  lastSession: LastSession | null;
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export function ResumeSession({ lastSession }: ResumeSessionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Hidden if no session
  if (!lastSession) return null;

  const handleResume = () => {
    if (loading) return;
    setLoading(true);
    router.push(`/study/${lastSession.deckId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.06 }}
      className="rounded-2xl bg-card border border-border p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg flex-shrink-0">
            <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-foreground">Continue Learning</p>
            <p className="text-sm font-semibold text-muted-foreground truncate">
              <span className="text-foreground">{lastSession.deckTitle}</span>
              <span className="text-muted-foreground/60 font-normal">
                {" "}· {timeAgo(lastSession.timestamp)}
              </span>
            </p>
          </div>
        </div>

        <Button
          onClick={handleResume}
          disabled={loading}
          variant="outline"
          className="gap-2 font-bold text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-xl px-5 h-9 transition-all flex-shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              Resume
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
