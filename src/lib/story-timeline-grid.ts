import type {
  EducationTimeline,
  EducationTimelineInterval,
  EducationTimelineMonth,
} from "@/types/content";

export type StoryTimeline = EducationTimeline;
export type StoryTimelineInterval = EducationTimelineInterval;
export type StoryTimelineMonth = EducationTimelineMonth;
export type ExperienceTimeline = EducationTimeline;

export interface StoryTimelineCell {
  year: number;
  month: number;
  color: string;
  char?: string;
  interval?: StoryTimelineInterval;
  isEmpty: boolean;
  tooltip?: string;
}

export const storyTimelineMonthsPerColumn = 6;

const DEFAULT_EMPTY_COLOR = "hsl(var(--timeline-empty))";

function compareMonths(
  left: StoryTimelineMonth,
  right: StoryTimelineMonth,
): number {
  if (left.year !== right.year) {
    return left.year - right.year;
  }

  return left.month - right.month;
}

function subtractMonths(
  month: StoryTimelineMonth,
  count: number,
): StoryTimelineMonth {
  let cursor = month;

  for (let index = 0; index < count; index += 1) {
    if (cursor.month === 1) {
      cursor = { year: cursor.year - 1, month: 12 };
    } else {
      cursor = { year: cursor.year, month: cursor.month - 1 };
    }
  }

  return cursor;
}

function monthInInterval(
  point: StoryTimelineMonth,
  interval: StoryTimelineInterval,
): boolean {
  if (compareMonths(point, interval.start) < 0) {
    return false;
  }

  if (!interval.end) {
    return true;
  }

  return compareMonths(point, interval.end) <= 0;
}

function findIntervalForMonth(
  point: StoryTimelineMonth,
  intervals: StoryTimelineInterval[],
): StoryTimelineInterval | undefined {
  return intervals.find((interval) => monthInInterval(point, interval));
}

function getEarliestIntervalStart(timeline: StoryTimeline): StoryTimelineMonth {
  return timeline.intervals
    .map((interval) => interval.start)
    .reduce((earliest, current) =>
      compareMonths(current, earliest) < 0 ? current : earliest,
    );
}

function getCurrentMonth(): StoryTimelineMonth {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function getHalfYearMonths(year: number, half: 1 | 2): StoryTimelineMonth[] {
  const startMonth = half === 1 ? 1 : 7;

  return Array.from({ length: storyTimelineMonthsPerColumn }, (_, index) => ({
    year,
    month: startMonth + index,
  }));
}

function halfYearHasVisibleMonth(
  year: number,
  half: 1 | 2,
  rangeStart: StoryTimelineMonth,
  rangeEnd: StoryTimelineMonth,
): boolean {
  return getHalfYearMonths(year, half).some(
    (month) =>
      compareMonths(month, rangeStart) >= 0 &&
      compareMonths(month, rangeEnd) <= 0,
  );
}

function createEmptyCell(
  month: StoryTimelineMonth,
  color: string,
  tooltip?: string,
): StoryTimelineCell {
  return {
    year: month.year,
    month: month.month,
    color,
    isEmpty: true,
    tooltip,
  };
}

function createActiveCell(
  month: StoryTimelineMonth,
  interval: StoryTimelineInterval,
): StoryTimelineCell {
  return {
    year: month.year,
    month: month.month,
    color: interval.color,
    char: interval.char,
    interval,
    isEmpty: false,
  };
}

export function resolveStoryTimelineIntervalColor(
  timeline: StoryTimeline,
  char?: string,
): string | undefined {
  if (!char) {
    return undefined;
  }

  return timeline.intervals.find((interval) => interval.char === char)?.color;
}

export function buildStoryTimelineCells(
  timeline: StoryTimeline,
): StoryTimelineCell[] {
  if (timeline.intervals.length === 0) {
    return [];
  }

  const emptyColor = timeline.emptyColor ?? DEFAULT_EMPTY_COLOR;
  const firstActiveStart = getEarliestIntervalStart(timeline);
  const paddingMonths = timeline.paddingMonths ?? 0;
  const rangeStart = subtractMonths(firstActiveStart, paddingMonths);
  const rangeEnd = getCurrentMonth();
  const cells: StoryTimelineCell[] = [];

  for (let year = rangeStart.year; year <= rangeEnd.year; year += 1) {
    for (const half of [1, 2] as const) {
      if (!halfYearHasVisibleMonth(year, half, rangeStart, rangeEnd)) {
        continue;
      }

      for (const month of getHalfYearMonths(year, half)) {
        if (compareMonths(month, rangeStart) < 0) {
          cells.push(createEmptyCell(month, emptyColor));
          continue;
        }

        if (compareMonths(month, rangeEnd) > 0) {
          cells.push(createEmptyCell(month, emptyColor));
          continue;
        }

        const isPaddingMonth =
          compareMonths(month, firstActiveStart) < 0 && paddingMonths > 0;
        const interval = findIntervalForMonth(month, timeline.intervals);

        if (isPaddingMonth) {
          cells.push(
            createEmptyCell(month, emptyColor, timeline.paddingTooltip),
          );
          continue;
        }

        if (interval) {
          cells.push(createActiveCell(month, interval));
          continue;
        }

        cells.push(createEmptyCell(month, emptyColor));
      }
    }
  }

  return cells;
}

export function formatStoryTimelineMonth(year: number, month: number): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

export const storyTimelineCellSizePx = 22;

export const storyTimelineCellGapPx = 4;

/** Matches `gap-2` between the cell grid and year labels in activity grids. */
export const storyTimelineSectionGapPx = 8;

/** Approximate height of the year label row (`text-[10px]` mono label). */
export const storyTimelineYearLabelHeightPx = 14;

export function getStoryTimelineGridHeightPx(): number {
  const cellGridHeight =
    storyTimelineMonthsPerColumn * storyTimelineCellSizePx +
    (storyTimelineMonthsPerColumn - 1) * storyTimelineCellGapPx;

  return (
    cellGridHeight + storyTimelineSectionGapPx + storyTimelineYearLabelHeightPx
  );
}

export function getStoryTimelineColumnCount(cellCount: number): number {
  return Math.ceil(cellCount / storyTimelineMonthsPerColumn);
}

export interface StoryTimelineYearLabel {
  columnStart: number;
  columnSpan: number;
  year: number;
}

export function getStoryTimelineYearLabels(
  columnCount: number,
  cells: StoryTimelineCell[],
): StoryTimelineYearLabel[] {
  const labels: StoryTimelineYearLabel[] = [];

  for (let column = 0; column < columnCount; column += 2) {
    const firstCell = cells[column * storyTimelineMonthsPerColumn];

    if (!firstCell) {
      continue;
    }

    labels.push({
      columnStart: column,
      columnSpan: column + 1 < columnCount ? 2 : 1,
      year: firstCell.year,
    });
  }

  return labels;
}

export const buildEducationTimelineCells = buildStoryTimelineCells;
export const formatEducationTimelineMonth = formatStoryTimelineMonth;
export const resolveEducationIntervalColor = resolveStoryTimelineIntervalColor;
export const getEducationTimelineColumnCount = getStoryTimelineColumnCount;
export const getEducationTimelineYearLabels = getStoryTimelineYearLabels;
export type EducationTimelineCell = StoryTimelineCell;
export const educationTimelineMonthsPerColumn = storyTimelineMonthsPerColumn;
export const educationTimelineCellSizePx = storyTimelineCellSizePx;
export const educationTimelineCellGapPx = storyTimelineCellGapPx;
