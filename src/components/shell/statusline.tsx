"use client";

import { cn } from "@manovaspace/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { shell } from "@/content/shell";

const modeLinkClasses =
  "flex items-center px-3 uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

/**
 * Editor statusline.
 *
 * Geometry and type are the reference strip's: 28px tall, 11px JetBrains Mono
 * at 1.5 line-height, every segment is `px-3`, filled blocks are bold with
 * dark ink on the fill. No top border, no radii, no shadow — the bar is a
 * tone step above the canvas.
 */
export function Statusline() {
  const pathname = usePathname();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setTime(format.format(new Date()));

    tick();
    const timer = window.setInterval(tick, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(var(--statusline-h)+env(safe-area-inset-bottom))] items-stretch bg-card pb-[env(safe-area-inset-bottom)] font-mono text-[11px] text-muted-foreground leading-[1.5]">
      <nav aria-label={shell.navLabel} className="flex items-stretch">
        {pathname === shell.homeHref ? (
          <span className="flex items-center bg-status-success px-3 font-bold text-status-success-foreground uppercase">
            {shell.neutralLabel}
          </span>
        ) : null}

        {shell.modeOrder.map((view) => {
          const mode = shell.modes[view];
          const isActive = pathname === mode.href;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                modeLinkClasses,
                isActive
                  ? "bg-status-success font-bold text-status-success-foreground"
                  : "hover:text-foreground",
              )}
              href={isActive ? shell.homeHref : mode.href}
              key={view}
            >
              {mode.label}
            </Link>
          );
        })}
      </nav>

      <span className="flex items-center px-3">
        {shell.buffer.prefix}
        {shell.buffer.section}
      </span>

      <span className="hidden items-center px-3 opacity-60 sm:flex">
        {shell.meta}
      </span>

      <span aria-hidden="true" className="flex-1" />

      <span className="hidden items-center px-3 sm:flex">{time}</span>

      <span className="flex items-center bg-primary px-3 font-bold text-primary-foreground uppercase">
        {shell.position}
      </span>
    </footer>
  );
}
