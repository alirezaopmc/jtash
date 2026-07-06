"use client";

import { useEffect, useState } from "react";

export interface HeroStatusBarProps {
  status: string;
  statusLabel: string;
  dark?: boolean;
}

export function HeroStatusBar({
  status,
  statusLabel,
  dark = false,
}: HeroStatusBarProps) {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });

    const update = () => {
      setLocalTime(formatter.format(new Date()));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={
        dark
          ? "border-b border-band-dark-border bg-band-dark"
          : "border-b border-border bg-background"
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 font-mono text-xs lg:px-12">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span
            className={dark ? "text-band-dark-muted" : "text-muted-foreground"}
          >
            {statusLabel}
          </span>
          <span className="font-medium tracking-widest text-primary">
            {status}
          </span>
        </div>
        <span
          className={`hidden tracking-widest md:block ${dark ? "text-band-dark-muted" : "text-muted-foreground"}`}
        >
          {localTime}
        </span>
      </div>
    </div>
  );
}
