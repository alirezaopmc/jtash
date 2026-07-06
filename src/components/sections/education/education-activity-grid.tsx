"use client";

import { cn } from "@orbit/ui";
import { useMemo } from "react";
import {
  buildEducationTimelineCells,
  educationTimelineCellGapPx,
  educationTimelineCellSizePx,
  educationTimelineMonthsPerColumn,
  formatEducationTimelineMonth,
  getEducationTimelineColumnCount,
  getEducationTimelineYearLabels,
} from "@/lib/education-timeline-grid";
import type { EducationTimeline } from "@/types/content";
import { TimelineScrollContainer } from "../../story/timeline-scroll-container";

export interface EducationActivityGridProps {
  timeline: EducationTimeline;
  title: string;
  scrollHint: string;
  rightScrollHint: string;
  className?: string;
}

export function EducationActivityGrid({
  timeline,
  title,
  scrollHint,
  rightScrollHint,
  className,
}: EducationActivityGridProps) {
  const cells = useMemo(
    () => buildEducationTimelineCells(timeline),
    [timeline],
  );
  const columnCount = getEducationTimelineColumnCount(cells.length);
  const yearLabels = useMemo(
    () => getEducationTimelineYearLabels(columnCount, cells),
    [columnCount, cells],
  );

  if (cells.length === 0) {
    return null;
  }

  const cellSize = `${educationTimelineCellSizePx}px`;
  const cellGap = `${educationTimelineCellGapPx}px`;

  return (
    <div className={cn("mb-10", className)}>
      <p className="mono-label mb-4 text-muted-foreground">{title}</p>
      <TimelineScrollContainer
        scrollHint={scrollHint}
        rightScrollHint={rightScrollHint}
        fadeFromClassName="from-band-elevated"
      >
        <div className="inline-flex flex-col gap-2">
          <div
            className="inline-grid"
            style={{
              gap: cellGap,
              gridTemplateRows: `repeat(${educationTimelineMonthsPerColumn}, ${cellSize})`,
              gridTemplateColumns: `repeat(${columnCount}, ${cellSize})`,
              gridAutoFlow: "column",
            }}
            role="img"
            aria-label={`${title} activity grid`}
          >
            {cells.map((cell) => {
              const monthLabel = formatEducationTimelineMonth(
                cell.year,
                cell.month,
              );
              const label = cell.isEmpty
                ? undefined
                : `${monthLabel} · ${cell.interval?.name ?? ""}`;

              return (
                <div
                  key={`${cell.year}-${cell.month}`}
                  {...(label ? { title: label, "aria-label": label } : {})}
                  className={cn(
                    "rounded-[3px] border border-transparent",
                    cell.isEmpty && "cursor-default",
                  )}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell.color,
                  }}
                />
              );
            })}
          </div>
          <div
            className="inline-grid"
            style={{
              gap: cellGap,
              gridTemplateColumns: `repeat(${columnCount}, ${cellSize})`,
            }}
          >
            {yearLabels.map((label) => (
              <div
                key={`${label.columnStart}-${label.year}`}
                className="mono-label text-center text-[10px] text-muted-foreground"
                style={{
                  gridColumn: `${label.columnStart + 1} / span ${label.columnSpan}`,
                }}
              >
                {label.year}
              </div>
            ))}
          </div>
        </div>
      </TimelineScrollContainer>
      <div className="mt-4 flex flex-wrap gap-4">
        {timeline.intervals.map((interval) => (
          <div key={interval.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-4 w-4 shrink-0 rounded-[3px]"
              style={{ backgroundColor: interval.color }}
              aria-hidden
            />
            <span className="text-foreground">{interval.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
