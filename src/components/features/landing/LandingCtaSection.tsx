"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingCtaSection() {
  return (
    <section className="relative py-16 sm:py-24">
      <MaxWidthWrapper>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card px-6 py-12 text-center shadow-lg ring-1 ring-primary/10 sm:px-10 sm:py-14"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
            aria-hidden
          />
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary" aria-hidden />
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Curious what your notes become?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Upload once — see cards in minutes. Your dashboard tracks streaks, goals, and what to
            review next.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#home-upload-section"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 px-6 font-semibold shadow-md"
              )}
            >
              Try it now
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 font-semibold")}
            >
              Open dashboard
            </Link>
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}
