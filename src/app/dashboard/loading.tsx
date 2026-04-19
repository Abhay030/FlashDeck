import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

export default function DashboardLoading() {
  return (
    <MaxWidthWrapper className="py-12">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-lg bg-muted/50 animate-pulse" />
          <div className="h-4 w-72 rounded-md bg-muted/30 animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-muted/40 animate-pulse" />
      </div>

      {/* Heatmap skeleton */}
      <div className="h-10 w-full rounded-md bg-muted/20 animate-pulse mb-10" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 w-full mb-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-5 border border-border rounded-xl bg-card animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-4 w-24 bg-muted/50 rounded" />
              <div className="h-8 w-8 bg-muted/40 rounded-md" />
            </div>
            <div className="h-9 w-16 bg-muted/50 rounded-md" />
          </div>
        ))}
      </div>

      {/* Deck grid heading skeleton */}
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <div className="h-7 w-36 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-9 w-40 bg-muted/30 rounded-md animate-pulse" />
      </div>

      {/* Deck cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-5 border border-border rounded-xl bg-card animate-pulse space-y-3">
            <div className="h-5 w-3/4 bg-muted/50 rounded" />
            <div className="h-3 w-1/2 bg-muted/30 rounded" />
            <div className="flex gap-2 mt-4">
              <div className="h-8 flex-1 bg-muted/40 rounded-md" />
              <div className="h-8 flex-1 bg-muted/40 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
