"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Target,
  Zap,
  BookOpen,
  ArrowRight,
  Heart,
  Layers,
} from "lucide-react";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pillars = [
  {
    icon: Layers,
    title: "From document to deck",
    desc: "Semantic chunking, two AI passes, and deduplication — so you spend time recalling, not copy-pasting.",
  },
  {
    icon: Brain,
    title: "Memory that respects science",
    desc: "SM‑2 scheduling means each rating reshapes when you’ll see a card again — closer to how memory actually works.",
  },
  {
    icon: Target,
    title: "Habits you can feel",
    desc: "Streaks, goals, weak areas, and a dashboard that nudges you toward the next right action — not just more screens.",
  },
];

const milestones = [
  { year: "Today", text: "A production-style pipeline you can upload to, study with, and demo end-to-end." },
  { year: "Next", text: "Deeper personalization and accounts when they serve learning — not before." },
];

export function AboutPageContent() {
  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-20">
      <div className="absolute inset-0 -z-10 bg-warm-dots" aria-hidden />
      <div
        className="absolute right-0 top-0 -z-10 h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl"
        aria-hidden
      />

      <MaxWidthWrapper className="max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            About FlashDeck AI
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            We build tools for people who{" "}
            <span className="text-primary">refuse to forget what matters.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            FlashDeck turns dense PDFs into structured flashcards and a daily rhythm — so studying feels
            intentional, not improvised.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-lg ring-1 ring-primary/10 sm:p-12"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                The problem we care about
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Most learners don&apos;t fail because they&apos;re lazy — they fail because{" "}
                <strong className="text-foreground">making good cards takes forever</strong>. By the time
                the deck exists, the exam week is gone.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                FlashDeck exists to collapse that gap: upload, review what the AI proposed, and get into
                spaced repetition while the material is still fresh.
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10">
              <div className="flex items-center gap-3 text-primary">
                <Zap className="h-8 w-8" />
                <span className="text-lg font-semibold">Fast inference, thoughtful output</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Groq-backed generation keeps the loop tight; chunking and dedup keep the deck readable. The
                dashboard turns it into streaks, goals, and weak areas — so progress is visible, not vague.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What we optimize for
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Hover a card — same philosophy as the product: clarity first, delight second.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-transparent transition-all hover:border-primary/35 hover:shadow-md hover:ring-primary/15"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-primary/12 p-3 text-primary transition-transform group-hover:scale-105">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl border border-border/80 bg-muted/30 p-8 sm:p-10"
        >
          <h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">Where we&apos;re headed</h2>
          <div className="mx-auto mt-10 max-w-2xl space-y-8">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    {m.year}
                  </span>
                  {i < milestones.length - 1 && (
                    <div className="mt-2 h-full min-h-[2rem] w-px grow bg-border" aria-hidden />
                  )}
                </div>
                <p className="flex-1 pb-2 leading-relaxed text-muted-foreground">{m.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 overflow-hidden rounded-3xl border border-primary/25 bg-card p-8 text-center shadow-lg ring-1 ring-primary/15 sm:p-12"
        >
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Ready to see it yourself?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            One PDF is enough to feel the loop — upload, study, watch the dashboard come alive.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className={cn(buttonVariants({ size: "lg" }), "gap-2 font-semibold shadow-md")}>
              Try on home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "font-semibold")}
            >
              Open dashboard
            </Link>
          </div>
        </motion.div>

        <p className="mt-16 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Heart className="h-4 w-4 text-primary" />
          Built with curiosity about how people actually learn — not just how apps usually ship.
        </p>
      </MaxWidthWrapper>
    </div>
  );
}
