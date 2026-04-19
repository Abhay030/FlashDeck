"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, CheckCheck } from "lucide-react";

interface FlashcardProps {
  question: string;
  answer: string;
  topic: string;
  difficulty: string;
  isFlipped: boolean;
  isEdited?: boolean;
  /** Spaced-repetition schedule line (shown on answer side) */
  scheduleHint?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function Flashcard({
  question,
  answer,
  topic,
  difficulty,
  isFlipped,
  isEdited,
  scheduleHint,
  onEdit,
  onDelete,
}: FlashcardProps) {
  // Utilizing pure React style bindings for 3D transforms guarantees 
  // zero cross-browser glitches or Tailwind bundle dropping.

  const handleAction = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    if (action) action();
  };

  return (
    <div className="relative w-full max-w-[680px] h-[min(45vh,400px)] lg:h-[min(55vh,450px)] w-full mx-auto cursor-pointer group" style={{ perspective: "1200px" }}>
      <motion.div
        className="w-full h-full relative transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(251,187,59,0.25)] rounded-xl"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT OF CARD */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full",
            "bg-[#FFFCF5] dark:bg-card border-2 border-primary/30 rounded-xl shadow-md p-6 sm:p-10",
            "flex flex-col items-center justify-center text-center",
            isFlipped ? "pointer-events-none" : ""
          )}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-90">
            <div className="flex gap-2 items-center flex-wrap">
               <Badge className="text-xs uppercase tracking-wider bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300">{topic}</Badge>
               <Badge className={cn(
                 "text-xs capitalize border",
                 difficulty?.toLowerCase() === "easy" ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300" :
                 difficulty?.toLowerCase() === "hard" ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300" :
                 "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300"
               )}>{difficulty}</Badge>
               {isEdited && (
                 <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                   <CheckCheck className="w-3 h-3" /> Edited
                 </span>
               )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 shadow-sm border pointer-events-auto">
               {onEdit && (
                 <button onClick={(e) => handleAction(e, onEdit)} className="p-1.5 hover:bg-amber-100 text-amber-700 rounded-sm transition-colors" title="Edit Card">
                   <Pencil className="w-4 h-4" />
                 </button>
               )}
               {onDelete && (
                 <button onClick={(e) => handleAction(e, onDelete)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-sm transition-colors" title="Delete Card">
                   <Trash2 className="w-4 h-4" />
                 </button>
               )}
            </div>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
            {question}
          </h2>
          <div className="absolute bottom-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs animate-pulse opacity-70">
            Press Spacebar to flip
          </div>
        </div>

        {/* BACK OF CARD */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full",
            "bg-amber-50 dark:bg-amber-950/30 border-2 border-primary rounded-xl shadow-xl p-6 sm:p-10",
            "flex flex-col items-center justify-center text-center",
            !isFlipped ? "pointer-events-none" : ""
          )}
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <span className="text-xs font-black text-primary uppercase tracking-wider opacity-80 bg-primary/10 px-3 py-1 rounded-full">Answer</span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 shadow-sm border pointer-events-auto">
               {onEdit && (
                 <button onClick={(e) => handleAction(e, onEdit)} className="p-1.5 hover:bg-amber-100 text-amber-700 rounded-sm transition-colors" title="Edit Card">
                   <Pencil className="w-4 h-4" />
                 </button>
               )}
               {onDelete && (
                 <button onClick={(e) => handleAction(e, onDelete)} className="p-1.5 hover:bg-red-100 text-red-600 rounded-sm transition-colors" title="Delete Card">
                   <Trash2 className="w-4 h-4" />
                 </button>
               )}
            </div>
          </div>
          
          <div className="w-full max-h-[80%] overflow-y-auto custom-scrollbar px-5 text-left sm:text-center mt-6">
            <p className="text-base sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {answer}
            </p>
            {scheduleHint ? (
              <p className="mt-4 text-[11px] font-medium text-muted-foreground border-t border-primary/20 pt-3">
                {scheduleHint}
              </p>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
