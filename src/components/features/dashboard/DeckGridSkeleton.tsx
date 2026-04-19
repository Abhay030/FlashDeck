import { Skeleton } from "@/components/ui/skeleton";

export function DeckGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col border border-border rounded-xl p-5 bg-card space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <div className="pt-2 border-t border-border/50 flex gap-4">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <Skeleton className="h-10 w-full rounded-md mt-auto" />
        </div>
      ))}
    </div>
  );
}
