"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Sparkles, ArrowRight, Check } from "lucide-react";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ContactPageContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast.error("Email and message are required");
      return;
    }
    const subject = encodeURIComponent(`FlashDeck AI — message from ${name || "visitor"}`);
    const body = encodeURIComponent(
      `${message}\n\n---\nFrom: ${name || "Anonymous"}\nReply-to: ${email}`
    );
    window.location.href = `mailto:contact@flashdeck.ai?subject=${subject}&body=${body}`;
    setSent(true);
    toast.success("Opening your email app…", {
      description: "If nothing opens, copy the address from the card on the left.",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-20">
      <div className="absolute inset-0 -z-10 bg-warm-dots" aria-hidden />
      <div
        className="absolute left-1/2 top-24 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />

      <MaxWidthWrapper className="max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <MessageSquare className="h-4 w-4" />
            Contact
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Let&apos;s talk about{" "}
            <span className="text-primary">learning that lasts</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Questions, feedback, or ideas — we read every message. Prefer email? You&apos;ll get a
            mailto shortcut after you hit send.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center rounded-3xl border border-border/80 bg-card p-8 shadow-sm ring-1 ring-primary/10 lg:col-span-2"
          >
            <Sparkles className="mb-4 h-8 w-8 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Why reach out?</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Partnerships, demos, or classroom pilots
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Bug reports & feature ideas — you help the roadmap
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Press, recruiting, or portfolio walkthroughs
              </li>
            </ul>
            <div className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 dark:bg-primary/10">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                contact@flashdeck.ai
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Prefer typing manually? Use this address — we read every note.
              </p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border bg-card p-6 shadow-lg ring-1 ring-border/50 sm:p-8 lg:col-span-3"
          >
            <label className="block">
              <span className="text-sm font-semibold text-foreground">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
            </label>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-foreground">Email *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="you@university.edu"
                autoComplete="email"
              />
            </label>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-foreground">Message *</span>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="mt-1.5 w-full resize-y rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Tell us what you're building, learning, or curious about…"
              />
            </label>
            <Button type="submit" size="lg" className="mt-6 w-full gap-2 font-semibold shadow-md sm:w-auto">
              {sent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              {sent ? "Sent — check your mail app" : "Open in email app"}
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              This opens your default email client with your message pre-filled. No server — your privacy
              stays local until you hit send.
            </p>
          </motion.form>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/80 bg-muted/20 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <p className="font-semibold text-foreground">Rather explore first?</p>
            <p className="text-sm text-muted-foreground">Upload a PDF on the home page — no account required.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Back to home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </MaxWidthWrapper>
    </div>
  );
}
