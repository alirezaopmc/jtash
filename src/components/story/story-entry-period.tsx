import { Badge, cn } from "@orbit/ui";
import { parseStoryEntryPeriod } from "@/lib/parse-story-entry-period";

export interface StoryEntryPeriodProps {
  children: string;
  className?: string;
  align?: "start" | "end";
}

export function StoryEntryPeriod({
  children,
  className,
  align = "start",
}: StoryEntryPeriodProps) {
  const { dateRange, duration } = parseStoryEntryPeriod(children);

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-1.5",
        align === "end"
          ? "items-start sm:items-end sm:text-right"
          : "items-start",
        className,
      )}
    >
      <p className="font-mono text-sm font-semibold leading-snug tracking-tight text-period-accent sm:text-base">
        {dateRange}
      </p>
      {duration ? (
        <Badge
          variant="outline"
          className="rounded-md border-period-accent/20 bg-period-accent/8 px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-muted-foreground"
        >
          {duration}
        </Badge>
      ) : null}
    </div>
  );
}
