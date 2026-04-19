"use client";

import { HeroSection } from "@/components/features/landing/HeroSection";
import { HowItWorksSection } from "@/components/features/landing/HowItWorksSection";
import { FeatureShowcase } from "@/components/features/landing/FeatureShowcase";
import { TipsSection } from "@/components/features/landing/TipsSection";
import { LandingCtaSection } from "@/components/features/landing/LandingCtaSection";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeatureShowcase />
        <TipsSection />
        <LandingCtaSection />
      </main>

      <footer className="border-t border-border bg-background py-8 md:py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row md:px-6">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-foreground">FlashDeck AI</span> — turn PDFs into habits.
          </p>
          <div className="flex gap-6">
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
