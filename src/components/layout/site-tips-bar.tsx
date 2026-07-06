"use client";

import { cn } from "@orbit/ui";
import type { HeaderTips, UiLabels } from "@/types/content";
import { HeaderTipsTicker } from "./header-tips-ticker";

export interface SiteTipsBarProps {
  headerTips: HeaderTips;
  labels: UiLabels["headerTips"];
  className?: string;
}

export function SiteTipsBar({
  headerTips,
  labels,
  className,
}: SiteTipsBarProps) {
  if (headerTips.items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "sticky bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-3 lg:px-12">
        <HeaderTipsTicker
          items={headerTips.items}
          intervalMs={headerTips.intervalMs}
          label={labels.label}
          skipLabel={labels.skip}
        />
      </div>
    </div>
  );
}
