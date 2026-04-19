"use client";

import Link from "next/link";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { CircleHelp, LayoutDashboard, Mail, Tags } from "lucide-react";
import { motion } from "framer-motion";
import { WhyNoAuthNavLink } from "./WhyNoAuthDialog";

function FlashDeckLogo() {
  return (
    <Link href="/" className="group z-40 flex items-center gap-2" aria-label="FlashDeck Home">
      <div className="relative h-8 w-8 shrink-0">
        <motion.div
          className="absolute inset-0 rounded-md border border-primary/30 bg-primary/40"
          initial={{ rotate: 0, x: 0, y: 0 }}
          animate={{ rotate: -16, x: -9, y: 4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        />
        <motion.div
          className="absolute inset-0 rounded-md border border-primary/50 bg-primary/65"
          initial={{ rotate: 0, x: 0, y: 0 }}
          animate={{ rotate: -7, x: -3, y: 2 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-md border border-primary/80 bg-primary"
          initial={{ rotate: 0, x: 0, y: 0 }}
          animate={{ rotate: 7, x: 8, y: -2 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.18 }}
        >
          <span className="text-[10px] font-black leading-none text-primary-foreground">F</span>
        </motion.div>
      </div>

      <span className="select-none text-xl font-black tracking-tight">
        <span className="text-foreground">Flash</span>
        <span className="text-primary">Deck</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-16 w-full border-b border-border bg-background/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between gap-3">
          <FlashDeckLogo />

          <div className="hidden items-center space-x-8 text-base font-semibold md:flex">
            <Link
              href="/about"
              className="group relative flex items-center gap-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <CircleHelp className="h-4 w-4" />
              About
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/pricing"
              className="group relative flex items-center gap-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <Tags className="h-4 w-4" />
              Pricing
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/contact"
              className="group relative flex items-center gap-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Contact
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/dashboard"
              className="group relative flex items-center gap-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              Contact
            </Link>
            <WhyNoAuthNavLink className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" />
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === "/") {
                  const el = document.getElementById("home-upload-section");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    el.classList.add(
                      "ring-4",
                      "ring-primary",
                      "ring-offset-4",
                      "ring-offset-background",
                      "scale-105"
                    );
                    setTimeout(() => {
                      el.classList.remove(
                        "ring-4",
                        "ring-primary",
                        "ring-offset-4",
                        "ring-offset-background",
                        "scale-105"
                      );
                    }, 1200);
                  }
                } else if (window.location.pathname === "/dashboard") {
                  window.dispatchEvent(new Event("open-upload-modal"));
                } else {
                  window.location.href = "/dashboard";
                }
              }}
              className="bg-primary px-4 font-bold text-primary-foreground shadow-sm hover:brightness-105 sm:px-6"
            >
              Get started
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
