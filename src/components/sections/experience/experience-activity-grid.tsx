"use client";

import { cn } from "@manovaspace/ui";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import {
  buildStoryTimelineCells,
  formatStoryTimelineMonth,
  getStoryTimelineColumnCount,
  getStoryTimelineGridHeightPx,
  getStoryTimelineYearLabels,
  storyTimelineCellGapPx,
  storyTimelineCellSizePx,
  storyTimelineMonthsPerColumn,
} from "@/lib/story-timeline-grid";
import type { Experience, ExperienceTimeline } from "@/types/content";
import { TimelineScrollContainer } from "../../story/timeline-scroll-container";
import { ExperienceTimelineDisplay } from "./experience-timeline-display";

export interface ExperienceActivityGridProps {
  timeline: ExperienceTimeline;
  experiences: Experience[];
  title: string;
  scrollHint: string;
  rightScrollHint: string;
  detailsLabel: string;
  onDetailsClick?: (experience: Experience) => void;
  className?: string;
}

function buildExperienceLookup(experiences: Experience[]) {
  return new Map(experiences.map((item) => [item.company, item]));
}

function getDefaultExperience(
  timeline: ExperienceTimeline,
  experienceByCompany: Map<string, Experience>,
) {
  for (const interval of timeline.intervals) {
    const experience = experienceByCompany.get(interval.name);
    if (experience) {
      return experience;
    }
  }

  return experiencesFromMap(experienceByCompany)[0] ?? null;
}

function experiencesFromMap(experienceByCompany: Map<string, Experience>) {
  return [...experienceByCompany.values()];
}

export function ExperienceActivityGrid({
  timeline,
  experiences,
  title,
  scrollHint,
  rightScrollHint,
  detailsLabel,
  onDetailsClick,
  className,
}: ExperienceActivityGridProps) {
  const experienceByCompany = useMemo(
    () => buildExperienceLookup(experiences),
    [experiences],
  );
  const [displayedExperience, setDisplayedExperience] =
    useState<Experience | null>(() =>
      getDefaultExperience(timeline, experienceByCompany),
    );
  const [hoveredCellKey, setHoveredCellKey] = useState<string | null>(null);
  // When a user clicks a cell we "lock" the panel content to that cell.
  // While locked, hover/focus should not update the panel.
  const [lockedCellKey, setLockedCellKey] = useState<string | null>(null);
  const lockedCellKeyRef = useRef<string | null>(null);
  lockedCellKeyRef.current = lockedCellKey;
  const cells = useMemo(() => buildStoryTimelineCells(timeline), [timeline]);
  const legendIntervals = useMemo(
    () => [...timeline.intervals].reverse(),
    [timeline.intervals],
  );
  const columnCount = getStoryTimelineColumnCount(cells.length);
  const yearLabels = useMemo(
    () => getStoryTimelineYearLabels(columnCount, cells),
    [columnCount, cells],
  );
  const gridRef = useRef<HTMLDivElement>(null);

  if (cells.length === 0) {
    return null;
  }

  const cellSize = `${storyTimelineCellSizePx}px`;
  const cellGap = `${storyTimelineCellGapPx}px`;
  const timelineGridHeightPx = getStoryTimelineGridHeightPx();

  const activateCell = (cellKey: string, experience: Experience) => {
    setHoveredCellKey(cellKey);
    if (!lockedCellKeyRef.current) {
      setDisplayedExperience(experience);
    }
  };

  const clearHover = () => {
    setHoveredCellKey(lockedCellKeyRef.current);
  };

  const resolveCellFromTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      return null;
    }

    const cell = target.closest<HTMLElement>("[data-timeline-cell]");
    if (!cell || !gridRef.current?.contains(cell)) {
      return null;
    }

    const cellKey = cell.dataset.cellKey;
    if (!cellKey) {
      return null;
    }

    const experience = experienceByCompany.get(cell.dataset.company ?? "");
    if (!experience) {
      return null;
    }

    return { cellKey, experience };
  };

  const handleGridPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const resolved = resolveCellFromTarget(event.target);
    if (!resolved) {
      return;
    }

    activateCell(resolved.cellKey, resolved.experience);
  };

  const handleCellClick = (cellKey: string, experience: Experience) => {
    if (lockedCellKeyRef.current === cellKey) {
      lockedCellKeyRef.current = null;
      setLockedCellKey(null);
      setHoveredCellKey(null);
      setDisplayedExperience(
        getDefaultExperience(timeline, experienceByCompany),
      );
      return;
    }

    lockedCellKeyRef.current = cellKey;
    setLockedCellKey(cellKey);
    setHoveredCellKey(cellKey);
    setDisplayedExperience(experience);
  };

  return (
    <div className={cn("mb-10", className)}>
      <p className="mono-label mb-4 text-muted-foreground">{title}</p>
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-start">
        <TimelineScrollContainer
          className="min-w-0 shrink-0"
          scrollHint={scrollHint}
          rightScrollHint={rightScrollHint}
          onMouseLeave={() => {
            clearHover();
          }}
        >
          <div className="inline-flex flex-col gap-2 p-[2px]">
            <div
              ref={gridRef}
              className="relative inline-grid"
              onPointerMove={handleGridPointerMove}
              onMouseLeave={clearHover}
              style={{
                gap: cellGap,
                gridTemplateRows: `repeat(${storyTimelineMonthsPerColumn}, ${cellSize})`,
                gridTemplateColumns: `repeat(${columnCount}, ${cellSize})`,
                gridAutoFlow: "column",
              }}
              role="img"
              aria-label={`${title} activity grid`}
            >
              {cells.map((cell) => {
                const cellKey = `${cell.year}-${cell.month}`;
                const monthLabel = formatStoryTimelineMonth(
                  cell.year,
                  cell.month,
                );
                const experience = cell.interval?.name
                  ? experienceByCompany.get(cell.interval.name)
                  : undefined;
                const label = cell.isEmpty
                  ? (cell.tooltip ?? monthLabel)
                  : `${monthLabel} · ${cell.interval?.name ?? ""}`;
                const isHovered =
                  lockedCellKey === null && hoveredCellKey === cellKey;
                const isLockedCell = lockedCellKey === cellKey;

                return (
                  <div
                    key={cellKey}
                    data-timeline-cell
                    data-cell-key={cellKey}
                    data-company={cell.interval?.name ?? ""}
                    className={cn(
                      "flex items-center justify-center rounded-[3px]",
                      !cell.isEmpty && experience && "cursor-pointer",
                    )}
                    style={{ width: cellSize, height: cellSize }}
                    role={cell.isEmpty ? undefined : "button"}
                    aria-pressed={isLockedCell ? true : undefined}
                    aria-disabled={cell.isEmpty ? true : undefined}
                    onPointerEnter={() => {
                      if (!cell.isEmpty && experience) {
                        activateCell(cellKey, experience);
                      }
                    }}
                    onFocus={() => {
                      if (!cell.isEmpty && experience) {
                        activateCell(cellKey, experience);
                      }
                    }}
                    onClick={() => {
                      if (!cell.isEmpty && experience) {
                        handleCellClick(cellKey, experience);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        !cell.isEmpty &&
                        experience
                      ) {
                        e.preventDefault();
                        handleCellClick(cellKey, experience);
                      }
                    }}
                    tabIndex={!cell.isEmpty && experience ? 0 : undefined}
                    aria-label={label}
                  >
                    <div
                      className={cn(
                        "pointer-events-none rounded-[3px] transition-shadow duration-150",
                        isLockedCell && !cell.isEmpty
                          ? "shadow-[0_0_0_2px_hsl(var(--foreground)/0.35)]"
                          : isHovered && !cell.isEmpty
                            ? "shadow-[0_0_0_2px_hsl(var(--foreground)/0.35)]"
                            : "shadow-none",
                        cell.isEmpty && "cursor-default",
                      )}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: cell.color,
                      }}
                    />
                  </div>
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
        {displayedExperience ? (
          <ExperienceTimelineDisplay
            experience={displayedExperience}
            detailsLabel={detailsLabel}
            onDetailsClick={onDetailsClick}
            heightPx={timelineGridHeightPx}
            className="w-full min-w-0 lg:justify-self-end"
          />
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {legendIntervals.map((interval) => (
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
