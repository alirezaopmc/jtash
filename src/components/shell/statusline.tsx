"use client";

import { cn } from "@manovaspace/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { shell } from "@/content/shell";

const modeLinkClasses =
  "inline-flex min-h-11 items-center px-3 font-medium uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:min-h-0";

/**
 * Editor-style statusline. The visual grammar is a terminal status strip: one
 * filled block marks the current state on the left (sage, dark ink), one filled
 * block closes the row on the right (clay, dark ink), everything between is
 * plain mono text on the bar surface.
 */
export function Statusline() {
  const pathname = usePathname();

  return (
    <nav
      aria-label={shell.navLabel}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(var(--statusline-h)+env(safe-area-inset-bottom))] items-stretch border-border border-t bg-card pb-[env(safe-area-inset-bottom)] font-mono text-[12px] text-muted-foreground sm:text-[13px]"
    >
      {shell.modeOrder.map((view) => {
        const mode = shell.modes[view];
        const isActive = pathname === mode.href;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              modeLinkClasses,
              isActive
                ? "bg-status-success text-status-success-foreground"
                : "hover:text-foreground",
            )}
            href={isActive ? shell.homeHref : mode.href}
            key={view}
          >
            {mode.label}
          </Link>
        );
      })}

      <span className="hidden items-center pl-3 text-foreground sm:inline-flex">
        {shell.buffer.prefix}
        {shell.buffer.section}
      </span>

      <span aria-hidden="true" className="flex-1" />

      <span className="inline-flex min-h-11 items-center bg-primary px-3 font-medium text-primary-foreground uppercase sm:min-h-0">
        {shell.position}
      </span>
    </nav>
  );
}
