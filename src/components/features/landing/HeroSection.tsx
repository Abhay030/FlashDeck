"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Pencil,
  LibrarySquare,
  ArrowRight,
} from "lucide-react";
import { productIcons } from "@/lib/productIcons";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { UploadCard } from "./UploadCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden pt-14">
      <div className="absolute inset-0 -z-10 bg-warm-dots" aria-hidden />

      <div
        className="absolute -top-24 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-orange-300/10 blur-3xl"
        aria-hidden
      />

      <Lightbulb className="absolute left-[8%] top-24 hidden h-12 w-12 rotate-12 text-amber-500/40 lg:block" strokeWidth={1.5} />
      <BookOpen className="absolute right-[12%] top-40 hidden h-14 w-14 -rotate-12 text-primary/30 xl:block" strokeWidth={1.5} />
      <GraduationCap className="absolute left-[20%] top-32 hidden h-16 w-16 text-primary/20 xl:block" strokeWidth={1.5} />
      <Brain className="absolute bottom-24 left-[10%] hidden h-16 w-16 text-amber-500/25 lg:block" strokeWidth={1.5} />
      <Pencil className="absolute bottom-40 right-[8%] hidden h-10 w-10 rotate-45 text-primary/40 lg:block" strokeWidth={1.5} />
      <LibrarySquare className="absolute right-[28%] top-16 hidden h-12 w-12 -rotate-6 text-blue-500/20 xl:block" strokeWidth={1.5} />

      <MaxWidthWrapper>
        <div className="mx-auto max-w-7xl px-6 py-10 lg:flex lg:items-center lg:gap-10 lg:px-8 lg:py-20">
          <div className="flex flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">FlashDeck AI — learn faster, forget slower</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-[3.35rem]"
            >
              Your PDFs become{" "}
              <span className="relative inline-block text-primary">
                flashcards you’ll actually use
                <svg
                  className="absolute -bottom-1 left-0 h-4 w-full text-primary"
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    d="M4 10 C60 4, 120 14, 180 8 S260 3, 296 10"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Drop a textbook or lecture notes — our pipeline chunks the text, runs two AI passes, dedupes
              similar cards, and hands you a deck wired for spaced repetition. Then your dashboard turns
              it into streaks, goals, and “what’s next.”
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-4 text-sm font-medium text-foreground/80"
            >
              What happens after upload? You’ll want to see it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start"
            >
              {(
                [
                  { Icon: productIcons.smartPdf, label: "Smart PDF → chunks" },
                  { Icon: productIcons.sm2, label: "SM‑2 scheduling" },
                  { Icon: productIcons.dashboardHabit, label: "Dashboard habits" },
                ] as const
              ).map(({ Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.34 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "gap-2 font-semibold"
                )}
              >
                See the dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs text-muted-foreground">Your decks live in this workspace</span>
            </motion.div>
          </div>

          <div className="mt-14 flex w-full justify-center perspective-1000 lg:mt-0 lg:w-1/2 lg:justify-end">
            <div className="relative rounded-2xl transition-all duration-300" id="home-upload-section">
              <div className="absolute inset-0 scale-110 rounded-3xl bg-primary/15 blur-2xl" aria-hidden />
              <UploadCard />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
