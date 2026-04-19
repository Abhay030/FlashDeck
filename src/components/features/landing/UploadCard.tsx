"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, File, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import { getClientMaxUploadBytes } from "@/lib/uploadLimits";

const PROCESSING_STAGES = [
  "Uploading PDF...",
  "Parsing document...",
  "AI extracting concepts...",
  "Synthesizing flashcards...",
  "Saving your deck...",
];

// Spark directions for the 6 radiating particles
const SPARKS = [
  { angle: 0,   dist: 48 },
  { angle: 60,  dist: 52 },
  { angle: 120, dist: 46 },
  { angle: 180, dist: 50 },
  { angle: 240, dist: 54 },
  { angle: 300, dist: 48 },
];

function SparkBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden>
      {SPARKS.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const tx = Math.round(Math.cos(rad) * s.dist);
        const ty = Math.round(Math.sin(rad) * s.dist);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, x: tx, y: ty, scale: 1.4 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.025 }}
            className="absolute w-2.5 h-2.5 rounded-full bg-primary"
          />
        );
      })}
    </div>
  );
}

export function UploadCard({ isModalContent = false }: { isModalContent?: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<string>("flashcards");
  const [isUploading, setIsUploading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [showSparks, setShowSparks] = useState(false);
  const stageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const triggerSparks = () => {
    setShowSparks(true);
    setTimeout(() => setShowSparks(false), 700);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast.error("Invalid file type", { description: "Please upload a valid PDF document." });
      return false;
    }
    const maxBytes = getClientMaxUploadBytes();
    if (selectedFile.size > maxBytes) {
      const mb = (maxBytes / (1024 * 1024)).toFixed(1);
      toast.error("File too large", {
        description: `Max ${mb} MB for this host (Vercel limits uploads to ~4.5 MB unless you use direct storage).`,
      });
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        triggerSparks();
        toast.success("Ready for processing", { description: droppedFile.name });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        triggerSparks();
        toast.success("Ready for processing", { description: selectedFile.name });
      }
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setIsUploading(true);
    setStageIndex(0);

    // Start cycling through processing stages every ~4s  
    stageIntervalRef.current = setInterval(() => {
      setStageIndex(prev => Math.min(prev + 1, PROCESSING_STAGES.length - 1));
    }, 4000);

    const toastId = toast.loading(PROCESSING_STAGES[0]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await parseJsonResponse<{
        error?: string;
        partial?: boolean;
        metadata?: { deckId?: string; newCardsAdded?: number };
      }>(response);

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);

      if (response.status === 206 || data.partial) {
        toast.warning("Partial save", {
          id: toastId,
          description:
            "Cards were generated but saving hit a snag. Head to the dashboard — your work may still be there.",
        });
        setIsUploading(false);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2800);
        return;
      }

      const added = typeof data.metadata?.newCardsAdded === "number" ? data.metadata.newCardsAdded : 0;
      toast.success("Deck ready", {
        id: toastId,
        description:
          added > 0 ? `${added} new card${added !== 1 ? "s" : ""} added — opening study…` : "Opening your deck…",
      });

      setTimeout(() => {
        setIsUploading(false);
        const deckId = data.metadata?.deckId as string | undefined;
        if (deckId && deckId !== "partial_unpersisted") {
          router.push(`/study/${deckId}`);
        } else {
          router.push("/dashboard");
        }
      }, 1200);
    } catch (error: any) {
      console.error(error);
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
      setStageIndex(0);
      toast.error("Upload failed", {
        id: toastId,
        description: error.message || "Something went wrong. Please check your file and try again.",
      });
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={isModalContent ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={isModalContent ? { duration: 0 } : { delay: 0.2, duration: 0.5 }}
      className={`w-full max-w-md mx-auto bg-card rounded-2xl border border-border/80 transition-all duration-300 overflow-hidden ${isModalContent ? 'shadow-2xl' : 'shadow-xl hover:-translate-y-1 hover:shadow-2xl'}`}
    >
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">Drop a PDF — get your first cards</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We&apos;ll chunk it, extract concepts, and drop you into study when it&apos;s ready.
          </p>
        </div>

        {/* Upload Zone */}
        <label
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all overflow-hidden ${
            file ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:bg-muted/50 hover:border-primary cursor-pointer'
          } ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          {/* Spark burst overlay */}
          <AnimatePresence>
            {showSparks && <SparkBurst />}
          </AnimatePresence>

          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div 
                key="file-ready"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center text-center p-4 cursor-pointer"
              >
                <File className="h-10 w-10 text-primary mb-2" />
                <p className="text-sm font-semibold truncate max-w-[250px] px-4">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="bg-background p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground/70">
                  PDF only — max size depends on host (~4.4&nbsp;MB on Vercel, 10&nbsp;MB locally). Long docs process in
                  batches.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </label>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Study Mode</label>
            <Select value={mode} onValueChange={(val) => val && setMode(val)} disabled={isUploading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select output type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flashcards">Flashcards (Active Recall)</SelectItem>
                <SelectItem value="mindmap" disabled>Mindmap (Coming Soon)</SelectItem>
                <SelectItem value="depth_summary" disabled>Depth Summary (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="relative h-12 w-full text-lg font-bold shadow-md disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!file || isUploading}
            onClick={handleGenerate}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {PROCESSING_STAGES[stageIndex]}
              </>
            ) : (
              `Generate ${mode === "flashcards" ? "flashcards" : mode}`
            )}
          </Button>

          <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground dark:bg-primary/10">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Decks save to your workspace. From the dashboard you can add more cards from the same PDF
              anytime.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
