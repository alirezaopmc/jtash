"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { shell } from "@/content/shell";

const modeLinkClasses =
  "inline-flex min-h-11 items-center px-3 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:min-h-0";

export function Statusline() {
  const pathname = usePathname();

  return (
    <nav
      aria-label={shell.navLabel}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(var(--statusline-h)+env(safe-area-inset-bottom))] items-stretch border-border border-t bg-background pb-[env(safe-area-inset-bottom)] font-mono text-[13px]"
    >
      {shell.modeOrder.map((view) => {
        const mode = shell.modes[view];
        const isActive = pathname === mode.href;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={`${modeLinkClasses} ${
              isActive
                ? "bg-foreground text-background uppercase"
                : "text-muted-foreground hover:text-foreground"
            }`}
            href={isActive ? shell.homeHref : mode.href}
            key={view}
          >
            {mode.label}
          </Link>
        );
      })}
      <span className="hidden items-center pl-3 text-muted-foreground sm:inline-flex">
        {shell.buffer.prefix}
        {shell.buffer.section}
      </span>
      <span aria-hidden="true" className="flex-1" />
      <span className="inline-flex items-center pr-3 text-muted-foreground">
        {shell.position}
      </span>
    </nav>
  );
}
