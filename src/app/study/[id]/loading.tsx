export default function StudyLoading() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-12 flex flex-col min-h-screen animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-4 w-16 bg-muted/50 rounded" />
        <div className="h-4 w-12 bg-muted/30 rounded" />
      </div>

      {/* Progress bar */}
      <div className="w-full mb-10">
        <div className="h-2 w-full bg-muted/20 rounded-full" />
        <div className="h-4 w-32 bg-muted/20 rounded mx-auto mt-3" />
      </div>

      {/* Card skeleton */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-2xl mx-auto aspect-[4/3] sm:aspect-[3/2] bg-card border-2 border-border rounded-xl shadow-lg flex items-center justify-center">
          <div className="space-y-3 w-2/3">
            <div className="h-4 bg-muted/40 rounded w-full" />
            <div className="h-4 bg-muted/40 rounded w-4/5 mx-auto" />
            <div className="h-4 bg-muted/30 rounded w-3/5 mx-auto" />
          </div>
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="mt-8 flex gap-3 justify-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 flex-1 max-w-[120px] bg-muted/30 rounded-md" />
        ))}
      </div>
    </div>
  );
}
