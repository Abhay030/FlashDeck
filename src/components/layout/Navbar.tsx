"use client";

import Link from "next/link";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Mail,
  BadgePercent,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { WhyNoAuthNavLink } from "./WhyNoAuthDialog";

function FlashDeckLogo() {
  const spring = { type: "spring" as const, stiffness: 220, damping: 17 };

  return (
    <Link
      href="/"
      className="group z-40 flex items-center gap-2 overflow-visible"
      aria-label="FlashDeck Home"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-visible">
        <motion.div
          className="absolute inset-0 rounded-md border border-primary/35 bg-primary/45"
          initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, rotate: -17, x: -7, y: 6 }}
          transition={{ ...spring, delay: 0.12 }}
        />
        <motion.div
          className="absolute inset-0 rounded-md border border-primary/55 bg-primary/68"
          initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, rotate: -9, x: -3, y: 3 }}
          transition={{ ...spring, delay: 0.22 }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-md border border-primary bg-primary shadow-sm"
          initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, rotate: 11, x: 6, y: -3 }}
          transition={{ ...spring, delay: 0.32 }}
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

const navLinkClass =
  "group relative flex items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-foreground";

export function Navbar() {
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-16 w-full border-b border-border bg-background/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between gap-3">
          <FlashDeckLogo />

          <div className="hidden items-center space-x-7 text-base font-semibold md:flex">
            <Link href="/about" className={navLinkClass}>
              <Info className="h-4 w-4 opacity-75 transition-opacity group-hover:opacity-100" aria-hidden />
              About
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/pricing" className={navLinkClass}>
              <BadgePercent className="h-4 w-4 opacity-75 transition-opacity group-hover:opacity-100" aria-hidden />
              Pricing
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/contact" className={navLinkClass}>
              <Mail className="h-4 w-4 opacity-75 transition-opacity group-hover:opacity-100" aria-hidden />
              Contact
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="h-4 w-4 opacity-75 transition-opacity group-hover:opacity-100" aria-hidden />
              Dashboard
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              <Mail className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
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
