import type { LucideIcon } from "lucide-react";
import {
  FileStack,
  Repeat,
  LayoutDashboard,
  Zap,
  GitMerge,
  FileUp,
  Wand2,
} from "lucide-react";

/** Same three concepts everywhere: PDF pipeline, SM‑2, dashboard / habits */
export const productIcons = {
  smartPdf: FileStack,
  sm2: Repeat,
  dashboardHabit: LayoutDashboard,
  aiPass: Zap,
  deduplication: GitMerge,
  /** How it works */
  upload: FileUp,
  aiBuild: Wand2,
} as const satisfies Record<string, LucideIcon>;
