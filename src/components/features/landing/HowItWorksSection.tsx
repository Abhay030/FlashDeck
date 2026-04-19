"use client";

import { motion } from "framer-motion";
import { FileUp, Wand2, Brain } from "lucide-react";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

const steps = [
  {
    step: "01",
    title: "Drop your PDF",
    body: "Notes, slides, or a chapter — one file is enough to get started.",
    icon: FileUp,
  },
  {
    step: "02",
    title: "AI builds the deck",
    body: "Concepts → flashcards — then smart dedup so you don’t drown in duplicates.",
    icon: Wand2,
  },
  {
    step: "03",
    title: "Study with science",
    body: "Rate cards, build a streak, and let SM‑2 bring cards back when you need them.",
    icon: Brain,
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative border-y border-border/60 bg-muted/20 py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-warm-dots opacity-40" aria-hidden />
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-primary"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            From PDF to memory — in three beats
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-muted-foreground"
          >
            No manual card writing. No guesswork. Just upload, review what was generated, and start
            the habit loop on your dashboard.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm ring-1 ring-primary/5"
              >
                <span className="text-[11px] font-bold tabular-nums text-primary/80">{s.step}</span>
                <div className="mt-4 inline-flex rounded-xl bg-primary/12 p-3 text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </motion.div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
