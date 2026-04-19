"use client";

import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { motion } from "framer-motion";
import { FileText, Sparkles, Target, BrainCircuit } from "lucide-react";

const features = [
  {
    icon: FileText,
    name: "Reads your PDF like a human",
    description:
      "Text is cleaned, then split into paragraph-aware chunks with sensible token limits — so the model sees real sections, not random character slices.",
    bg: "bg-[#FFF3D0]",
    border: "border-[#F5D76E]",
    accent: "text-[#B8860B]",
  },
  {
    icon: Sparkles,
    name: "Two AI passes, one tight deck",
    description:
      "First pass pulls key concepts; second pass turns them into Q&A cards. Powered by Groq for fast, structured JSON you can study immediately.",
    bg: "bg-[#FFE4F0]",
    border: "border-[#F4A0C2]",
    accent: "text-[#C2185B]",
  },
  {
    icon: Target,
    name: "Smarter deduplication",
    description:
      "Similar questions get merged using Jaccard-style overlap on wording — fewer near-duplicate cards, more distinct practice.",
    bg: "bg-[#D9F6FF]",
    border: "border-[#86D9F5]",
    accent: "text-[#0277BD]",
  },
  {
    icon: BrainCircuit,
    name: "Spaced repetition + room to grow",
    description:
      "Rate cards with SM‑2 scheduling. Big PDF? We process in batches — generate more from the same file without starting over.",
    bg: "bg-[#DCF5E8]",
    border: "border-[#72C99A]",
    accent: "text-[#2E7D32]",
  },
];

export function FeatureShowcase() {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-warm-grid opacity-60" aria-hidden />

      <MaxWidthWrapper>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Under the hood
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            Built to make learning{" "}
            <span className="relative inline-block text-primary">
              stick
              <svg
                className="absolute -bottom-1 left-0 h-3 w-full text-primary/50"
                viewBox="0 0 120 8"
                preserveAspectRatio="none"
                stroke="currentColor"
                fill="none"
                aria-hidden
              >
                <path d="M2 6 Q60 1 118 6" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
          >
            Not a toy demo — a full pipeline from document to deck to daily rhythm. Peek at what runs
            when you hit &ldquo;generate.&rdquo;
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className={`
                group relative flex cursor-default flex-col overflow-hidden rounded-2xl border-2 p-7
                ${feature.bg} ${feature.border}
                transition-all duration-250 hover:-translate-y-2 hover:shadow-xl
              `}
              >
                <div
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-white/35 text-current transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110"
                  aria-hidden
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </div>

                <h3 className={`mb-3 mt-6 text-xs font-semibold uppercase tracking-widest ${feature.accent}`}>
                  {feature.name}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-foreground/85">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
