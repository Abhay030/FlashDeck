import Link from "next/link";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  Star,
  Sparkles,
  FileText,
  BrainCircuit,
  BarChart3,
  Rocket,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "FlashDeck",
  description: "Simple, transparent pricing for AI flashcards.",
};

export default function PricingPage() {
  const planFeatures = {
    basic: [
      "3 AI-generated decks",
      "Up to 20 pages per PDF",
      "Core SM-2 scheduling",
      "Dashboard tracking for daily study",
    ],
    pro: [
      "Unlimited AI decks",
      "Up to 200 pages per PDF",
      "Faster extraction and larger batch generation",
      "Priority feedback and roadmap influence",
    ],
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-20">
      <div className="absolute inset-0 -z-10 bg-warm-dots" aria-hidden />
      <div
        className="absolute left-1/2 top-24 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
        aria-hidden
      />

      <MaxWidthWrapper className="max-w-5xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Pricing
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Choose your pace, keep the
            {" "}
            <span className="text-primary">learning loop</span>
            {" "}
            alive
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Start free to feel the workflow. Upgrade when you want bigger PDFs and faster iteration.
            No hidden surprises.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-3xl border border-border/80 bg-card p-8 shadow-sm ring-1 ring-border/50">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Basic</h2>
              <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-semibold text-muted-foreground">
                Best for trying the flow
              </span>
            </div>
            <p className="text-muted-foreground">Perfect to test quality before committing.</p>
            <div className="mb-8 mt-7">
              <span className="text-5xl font-black tracking-tight">$0</span>
              <span className="font-medium text-muted-foreground"> / forever</span>
            </div>
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Smart PDF
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                SM-2
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                Dashboard habits
              </span>
            </div>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mb-8 w-full font-semibold")}
            >
              Start free
            </Link>
            <ul className="space-y-4">
              {planFeatures.basic.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="relative overflow-hidden rounded-3xl border-2 border-primary bg-background p-8 shadow-xl shadow-primary/10">
            <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Pro</h2>
              <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Star className="h-3.5 w-3.5" />
                Most Popular
              </div>
            </div>
            <p className="text-muted-foreground">For deeper study and high-volume reading cycles.</p>
            <div className="mb-8 mt-7">
              <span className="text-5xl font-black tracking-tight">$8</span>
              <span className="font-medium text-muted-foreground"> / month</span>
            </div>
            <div className="mb-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground/90">
                <Rocket className="h-3.5 w-3.5 text-primary" />
                Bigger docs
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground/90">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Faster iteration
              </span>
            </div>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mb-8 w-full font-semibold shadow-md shadow-primary/20"
              )}
            >
              Upgrade to Pro
            </Link>
            <ul className="space-y-4">
              {planFeatures.pro.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground/90">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 rounded-2xl border border-border/80 bg-muted/20 px-6 py-7 text-center sm:px-8">
          <p className="text-sm text-muted-foreground">
            Not sure yet? Start free, upload one PDF, and feel the loop first.
          </p>
          <Link
            href="/dashboard"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Explore dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
