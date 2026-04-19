"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Library, Trash2, PlusCircle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UploadCard } from "@/components/features/landing/UploadCard";
import Link from "next/link";
import { toast } from "sonner";
import { computeDeckHealth, healthLabel } from "@/lib/deckHealth";

interface DeckGridProps {
  decks: any[];
  onDelete: (id: string) => void;
}

export function DeckGrid({ decks, onDelete }: DeckGridProps) {
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsUploadModalOpen(true);
    window.addEventListener("open-upload-modal", handler);
    return () => window.removeEventListener("open-upload-modal", handler);
  }, []);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const { id, title } = pendingDelete;

    try {
      const response = await fetch(`/api/decks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      toast.success(`"${title}" deleted`);
      onDelete(id);
    } catch (e) {
      toast.error("Failed to delete deck");
    }
  };

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck, i) => {
        const masteryPercent = Math.round((deck.masteredCardsCount / Math.max(deck.totalCardsCount, 1)) * 100);
        const healthScore = computeDeckHealth({
          totalCardsCount: deck.totalCardsCount,
          dueCardsCount: deck.dueCardsCount,
          weakCardsCount: deck.weakCardsCount,
          masteredCardsCount: deck.masteredCardsCount,
        });
        const healthWord = healthLabel(healthScore);

        return (
          <motion.div
            key={deck._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
            className="flex flex-col border border-border rounded-xl p-5 bg-card hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 transition-all duration-300 relative group"
          >
            {/* DELETE BUTTON (Visible on Hover) */}
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPendingDelete({ id: deck._id, title: deck.title }); }}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
              title="Delete Deck"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 text-primary p-2 rounded-md">
                <Library className="h-5 w-5" />
              </div>
              
              {/* Bold Due Badge */}
              {deck.dueCardsCount > 0 && (
                <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-500/20 mr-8 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  <Flame className="w-3.5 h-3.5" />
                  {deck.dueCardsCount} Due
                </div>
              )}
            </div>

            <h3 className="font-extrabold text-base mb-1 line-clamp-2 min-h-[48px] leading-snug pr-4">
              {deck.title}
            </h3>
            <p className="mb-3 text-[11px] font-medium text-muted-foreground">
              Deck health{" "}
              <span className="font-semibold tabular-nums text-foreground">{healthScore}</span>
              <span className="text-muted-foreground"> · {healthWord}</span>
            </p>

            <div className="space-y-3 mb-5 mt-auto border-t border-border/50 pt-4">              
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">{deck.totalCardsCount} cards total</span>
                <span className={masteryPercent > 80 ? "text-green-500" : "text-primary"}>
                  {masteryPercent}% Mastered
                </span>
              </div>
              <Progress 
                value={masteryPercent} 
                className={`h-2 w-full ${masteryPercent > 80 ? '[&>div]:bg-green-500' : ''}`} 
              />
            </div>

            <div className="mt-auto flex w-full flex-col gap-2">
              {deck.dueCardsCount > 0 && (
                <Link href={`/study/${deck._id}`} className="block w-full">
                  <Button className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                    Study due cards
                  </Button>
                </Link>
              )}
              {deck.weakCardsCount > 0 && (
                <Link href={`/study/${deck._id}?mode=weak`} className="block w-full">
                  <Button variant="outline" className="w-full border-primary/30 font-semibold hover:bg-primary/10">
                    Practice weak ({deck.weakCardsCount})
                  </Button>
                </Link>
              )}
              <Link href={`/study/${deck._id}?mode=all`} className="block w-full">
                <Button 
                  variant={deck.dueCardsCount > 0 ? "outline" : "default"} 
                  className="w-full font-semibold"
                >
                  Study all cards
                </Button>
              </Link>
            </div>
          </motion.div>
        );
      })}

      {/* CREATE NEW DECK CARD */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogTrigger className="w-full h-full appearance-none outline-none text-left">
          <motion.div 
            className="flex flex-col border-2 border-dashed border-border rounded-xl p-6 bg-transparent hover:bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer items-center justify-center text-center h-full min-h-[250px] group"
          >
            <div className="bg-muted group-hover:bg-primary/10 p-4 rounded-full mb-4 transition-colors">
              <PlusCircle className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-lg">Create New Deck</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">Upload a PDF to generate AI flashcards</p>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-md" showCloseButton={false}>
          <UploadCard isModalContent={true} />
        </DialogContent>
      </Dialog>
    </div>

      <ConfirmDialog
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Delete Deck?"
        description={`"${pendingDelete?.title}" and all its flashcards will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Deck"
      />
    </>
  );
}
