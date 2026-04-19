"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        <div className="bg-red-500/10 p-4 rounded-full mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          We had trouble loading your dashboard. This is usually a temporary issue — give it another try.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={reset} className="flex-1 gap-2">
            <RotateCcw className="w-4 h-4" />
            Try again
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Home className="w-4 h-4" />
              Go home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
