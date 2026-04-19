"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, UploadCloud, Loader2, File, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import { getClientMaxUploadBytes } from "@/lib/uploadLimits";

interface Deck {
  _id: string;
  title: string;
  totalCardsCount: number;
}

interface ExpandDeckCardProps {
  decks: Deck[];
}

export function ExpandDeckCard({ decks }: ExpandDeckCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState(decks[0]?._id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (decks.length === 0) return null;

  const selectedDeck = decks.find((d) => d._id === selectedDeckId);

  const validateFile = (f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Invalid file type", { description: "Please upload a PDF." });
      return false;
    }
    const maxBytes = getClientMaxUploadBytes();
    if (f.size > maxBytes) {
      toast.error("File too large", {
        description: `Max ${(maxBytes / (1024 * 1024)).toFixed(1)} MB on this host.`,
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleExpand = async () => {
    if (!file || !selectedDeckId) return;
    setUploading(true);
    const toastId = toast.loading("Generating additional flashcards...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", "flashcards");
      formData.append("expandDeckId", selectedDeckId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await parseJsonResponse<{
        error?: string;
        metadata?: { newCardsAdded?: number; deckId?: string };
      }>(res);

      if (!res.ok) throw new Error(data.error || "Upload failed");

      toast.success("Cards generated!", {
        id: toastId,
        description: `${data.metadata?.newCardsAdded ?? ""} new cards added.`,
      });

      setUploading(false);

      setTimeout(() => {
        if (data.metadata?.deckId) {
          router.push(`/study/${data.metadata.deckId}`);
        } else {
          router.refresh();
        }
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error("Failed", { id: toastId, description: message });
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/30"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/15 p-1.5 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Expand your deck</p>
            <p className="text-xs text-muted-foreground">
              Re-upload the PDF to generate the next sections of cards.
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expand-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border px-5 pb-5 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Target deck
                </label>
                <select
                  value={selectedDeckId}
                  onChange={(e) => setSelectedDeckId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {decks.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.title} ({d.totalCardsCount} cards)
                    </option>
                  ))}
                </select>
              </div>

              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                  file
                    ? "border-primary/50 bg-primary/10 dark:bg-primary/15"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {file ? (
                  <div className="flex flex-col items-center p-2 text-center">
                    <File className="mb-1 h-7 w-7 text-primary" />
                    <p className="max-w-[220px] truncate text-xs font-semibold">{file.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <UploadCloud className="mb-1 h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Drag & drop or click to upload PDF</p>
                  </div>
                )}
              </label>

              <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-[11px] text-muted-foreground dark:bg-primary/10">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p>
                  New cards are appended to{" "}
                  <span className="font-semibold text-foreground">{selectedDeck?.title}</span> when you
                  upload the same document again (incremental generation).
                </p>
              </div>

              <Button
                onClick={handleExpand}
                disabled={!file || uploading}
                className="h-10 w-full gap-2 rounded-xl font-semibold shadow-md transition-all disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing next sections…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Continue learning
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
