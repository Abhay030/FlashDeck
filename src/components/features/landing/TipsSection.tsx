"use client";

import { motion } from "framer-motion";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

const tips = [
  {
    emoji: "📝",
    title: "Structured notes win",
    description:
      "PDFs with clear headings and bullets give sharper cards than one giant wall of text — the AI finds concepts faster.",
    bg: "bg-[#FFF3D0]",
    border: "border-[#F5D76E]",
    accent: "text-[#A0780A]",
  },
  {
    emoji: "🚫",
    title: "Text, not photos",
    description:
      "Scanned pages without a text layer won’t parse well. Export a text-based PDF from your notes app when you can.",
    bg: "bg-[#FFE4F0]",
    border: "border-[#F4A0C2]",
    accent: "text-[#C2185B]",
  },
  {
    emoji: "📏",
    title: "Start focused",
    description:
      "A tight chapter or 5–20 pages often yields the best first deck. You can always generate more sections later.",
    bg: "bg-[#D9F6FF]",
    border: "border-[#86D9F5]",
    accent: "text-[#0277BD]",
  },
  {
    emoji: "🔤",
    title: "English shines brightest",
    description:
      "The models are tuned for clear English. Other languages can work, but mixed or noisy text may need a quick edit pass.",
    bg: "bg-[#DCF5E8]",
    border: "border-[#72C99A]",
    accent: "text-[#2E7D32]",
  },
];

export function TipsSection() {
  return (
    <div className="relative overflow-hidden bg-muted/30 py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-warm-dots opacity-50" aria-hidden />

      <MaxWidthWrapper>
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary"
          >
            First upload?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
          >
            Get results that{" "}
            <span className="text-primary">wow you</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
          >
            Small choices before upload = sharper cards after — so your first session feels addictive, not
            frustrating.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className={`
                group relative flex cursor-default flex-col overflow-hidden rounded-2xl border-2 p-7
                ${tip.bg} ${tip.border}
                transition-all duration-250 hover:-translate-y-2 hover:shadow-xl
              `}
            >
              <span
                className="absolute -top-2 right-4 select-none text-5xl transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110"
                aria-hidden
              >
                {tip.emoji}
              </span>

              <h3 className={`mb-3 mt-6 text-xs font-semibold uppercase tracking-widest ${tip.accent}`}>
                {tip.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-foreground/85">{tip.description}</p>
            </motion.div>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
