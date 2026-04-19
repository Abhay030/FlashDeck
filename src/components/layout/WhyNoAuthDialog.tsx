"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Zap, Heart, Rocket, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: Zap,
    title: "Zero friction to your first deck",
    body: "We want curiosity to win the moment you land here — not a form, not a verification email. Upload a PDF and you’re already learning.",
  },
  {
    icon: Shield,
    title: "Reviewers see the real product",
    body: "Anyone evaluating FlashDeck — especially in a time-boxed review — can walk the full pipeline: PDF → cards → dashboard → study. No dummy accounts, no “sign up to continue.”",
  },
  {
    icon: Heart,
    title: "Learning is the product",
    body: "Accounts, OAuth, and billing are important — but they’re not what makes you remember. We’re investing our energy in chunking, AI quality, spaced repetition, and habits you’ll feel proud of.",
  },
];

export function WhyNoAuthNavLink({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
        }
      >
        Log in
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="max-h-[min(90vh,720px)] max-w-[calc(100%-1.5rem)] gap-0 overflow-y-auto border-border/80 bg-card p-0 sm:max-w-lg"
        >
          <div className="relative overflow-hidden border-b border-primary/15 bg-primary/8 px-6 pb-6 pt-8 dark:bg-primary/12">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl"
              aria-hidden
            />
            <DialogHeader className="relative gap-3 text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Why there’s no login yet
              </div>
              <DialogTitle className="text-left text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                We chose learning over login — on purpose.
              </DialogTitle>
              <DialogDescription className="text-left text-base leading-relaxed text-muted-foreground">
                FlashDeck AI is built so you can <strong className="text-foreground">grow</strong>, not get
                stuck at a gate. Here&apos;s the thinking — and why we&apos;re proud of it.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-6 py-6">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                  className="flex gap-4 rounded-2xl border border-border/80 bg-muted/20 p-4 dark:bg-muted/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{h.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
                  </div>
                </motion.div>
              );
            })}

            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground dark:bg-primary/10">
              <p className="flex items-start gap-2">
                <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="text-foreground">What’s next?</strong> Real authentication when we&apos;re
                  ready to personalize your workspace across devices — without rushing past the core:
                  helping you <em>actually</em> remember what you read.
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row sm:justify-end sm:gap-3">
            <Button variant="outline" className="font-semibold" type="button" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "default" }), "font-semibold shadow-sm")}
            >
              Go to dashboard
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
