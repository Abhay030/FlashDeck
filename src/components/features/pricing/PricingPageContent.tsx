"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Gift,
  Crown,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is there a real payment flow in this demo?",
    a: "Pricing here describes a future product shape. Today the app is free to explore so recruiters and learners can try the full pipeline — upload, study, dashboard — with no checkout wall.",
  },
  {
    q: "What counts as a deck?",
    a: "Each time you generate from a PDF (or expand a deck) you grow your library. Limits in the Basic column are placeholders for a future tier; the demo doesn’t enforce them today.",
  },
  {
    q: "Can I use this without an account?",
    a: "Yes — that’s intentional. We wanted zero friction so you see the learning loop first. See “Log in” in the nav for why we skipped auth for now.",
  },
];

export function PricingPageContent() {
  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-20">
      <div className="absolute inset-0 -z-10 bg-warm-dots" aria-hidden />
      <div
        className="absolute left-1/2 top-32 -z-10 h-[min(90vw,480px)] w-[min(90vw,480px)] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-24 right-0 -z-10 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl"
        aria-hidden
      />

      <MaxWidthWrapper className="max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Pricing
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Invest in{" "}
            <span className="text-primary">memory that lasts</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Transparent tiers for when we turn the demo into a product. Today, try everything — PDFs, AI
            cards, SM‑2, and your dashboard — with no gate.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative flex flex-col rounded-3xl border border-border/80 bg-card p-8 shadow-sm ring-1 ring-border/40 sm:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-foreground ring-1 ring-border">
                <Gift className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Start here
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-foreground">Basic</h2>
            <p className="mt-1 text-muted-foreground">Perfect to learn the workflow and build a rhythm.</p>
            <div className="mt-8 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight text-foreground">$0</span>
              <span className="text-muted-foreground">/ forever</span>
            </div>
            <ul className="mt-8 flex-1 space-y-4 text-sm font-medium">
              {[
                "AI-generated decks from your PDFs",
                "Up to 20 pages per upload (tier placeholder)",
                "SM‑2 spaced repetition & study modes",
                "Dashboard: streaks, goals, insights",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-10 w-full justify-center gap-2 font-semibold"
              )}
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-primary bg-card p-8 shadow-xl ring-1 ring-primary/20 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/25 blur-3xl" aria-hidden />
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-primary" aria-hidden />
            <div className="relative flex items-start justify-between gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <Crown className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <Zap className="h-3.5 w-3.5" />
                Most popular
              </span>
            </div>
            <h2 className="relative mt-6 text-2xl font-semibold text-foreground">Pro</h2>
            <p className="relative mt-1 text-muted-foreground">
              For power learners and heavier material — coming when we ship billing.
            </p>
            <div className="relative mt-8 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight text-foreground">$8</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <ul className="relative mt-8 flex-1 space-y-4 text-sm font-medium">
              {[
                "Everything in Basic",
                "Higher page limits per PDF (placeholder)",
                "Faster extraction & priority model queue (planned)",
                "Image & diagram parsing — on the roadmap",
                "Priority email support",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.25} />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "relative mt-10 flex w-full items-center justify-center gap-2 font-semibold shadow-lg"
              )}
            >
              Explore the app
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="relative mt-4 text-center text-xs text-muted-foreground">
              No checkout in this build — use the dashboard and study flow as the real product demo.
            </p>
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border border-border/80 bg-muted/25 p-8 sm:p-10"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <ShieldCheck className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Why show pricing now?</h3>
                <p className="text-sm text-muted-foreground">
                  So you know we’re serious about sustainability — without blocking anyone from the demo.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 space-y-4"
        >
          <h3 className="flex items-center gap-2 text-center text-lg font-semibold text-foreground sm:text-left">
            <HelpCircle className="h-5 w-5 text-primary" />
            Common questions
          </h3>
          <div className="grid gap-4 sm:grid-cols-1">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-border/70 bg-card/80 p-5 text-left shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <p className="font-semibold text-foreground">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-8 sm:flex-row sm:px-8"
        >
          <div className="text-center sm:text-left">
            <p className="font-semibold text-foreground">Questions before you dive in?</p>
            <p className="text-sm text-muted-foreground">We’re happy to walk through the learning loop.</p>
          </div>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "default" }), "gap-2 font-semibold shadow-md")}
          >
            Contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </MaxWidthWrapper>
    </div>
  );
}
