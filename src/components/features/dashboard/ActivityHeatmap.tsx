"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ActivityHeatmap({ heatmapData = [] }: { heatmapData?: { date: Date | string; count: number }[] }) {

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted/30 dark:bg-muted/10";
    if (count < 10) return "bg-primary/35 dark:bg-primary/30";
    if (count < 30) return "bg-primary/65 dark:bg-primary/55";
    return "bg-primary dark:bg-primary/90";
  };

  return (
    <div className="flex flex-col overflow-x-auto pb-2">
      <div className="flex items-center justify-between mb-3">
         <p className="text-xs font-medium text-muted-foreground tracking-tight">Last 60 days</p>
         <span className="text-xs text-muted-foreground flex items-center gap-2">
            Less
            <div className="flex gap-1">
               <div className="h-3 w-3 rounded-sm bg-muted/30 dark:bg-muted/10" />
               <div className="h-3 w-3 rounded-sm bg-primary/35 dark:bg-primary/30" />
               <div className="h-3 w-3 rounded-sm bg-primary/65 dark:bg-primary/55" />
               <div className="h-3 w-3 rounded-sm bg-primary dark:bg-primary/90" />
            </div>
            More
         </span>
      </div>
      <div className="flex gap-1">
        <TooltipProvider delay={100}>
          {heatmapData.map((day, i) => {
            const parsedDate = new Date(day.date);
            return (
              <Tooltip key={i}>
                 <TooltipTrigger 
                   className={`w-4 h-4 rounded-[3px] border border-black/5 hover:border-black/20 dark:border-white/5 dark:hover:border-white/20 transition-colors cursor-pointer ${getColor(day.count)}`} 
                 />
                 <TooltipContent sideOffset={5} className="font-semibold text-xs">
                   {day.count} reviews on {parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                 </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
