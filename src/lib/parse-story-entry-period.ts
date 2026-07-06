export interface ParsedStoryEntryPeriod {
  dateRange: string;
  duration?: string;
}

const DURATION_SUFFIX = /\s+\(([^)]+)\)\s*$/;

export function parseStoryEntryPeriod(period: string): ParsedStoryEntryPeriod {
  const match = period.match(DURATION_SUFFIX);

  if (!match || match.index === undefined) {
    return { dateRange: period.trim() };
  }

  return {
    dateRange: period.slice(0, match.index).trim(),
    duration: match[1]?.trim(),
  };
}
