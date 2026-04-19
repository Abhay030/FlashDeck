"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error Boundary]", error);
  }, [error]);

  return (
    <html>
      <body className="bg-background text-foreground min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="bg-red-500/10 p-4 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Unexpected Error</h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Something unexpected happened. Your data is safe — please try again or return to the home page.
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
      </body>
    </html>
  );
}
