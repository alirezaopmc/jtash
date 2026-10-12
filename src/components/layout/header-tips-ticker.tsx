"use client";

import { Button, cn, Progress, SkipForwardIcon } from "@manovaspace/ui";
import { useEffect, useRef, useState } from "react";

const DEFAULT_INTERVAL_MS = 10_000;
const TIP_TRANSITION_MS = 280;

export interface HeaderTipsTickerProps {
  items: string[];
  intervalMs?: number;
  label: string;
  skipLabel: string;
  className?: string;
}

export function HeaderTipsTicker({
  items,
  intervalMs = DEFAULT_INTERVAL_MS,
  label,
  skipLabel,
  className,
}: HeaderTipsTickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [exitingTip, setExitingTip] = useState<{
    key: string;
    text: string;
  } | null>(null);
  const previousTipRef = useRef<{ key: string; text: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setProgress(0);
  }, [items]);

  useEffect(() => {
    if (!isMounted || items.length === 0) {
      return;
    }

    setProgress(0);
    const startedAt = performance.now();
    let frameId = 0;
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) {
        return;
      }

      const elapsed = now - startedAt;
      const nextProgress = Math.min(elapsed / intervalMs, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setActiveIndex((current) => (current + 1) % items.length);
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [items, activeIndex, intervalMs, isMounted]);

  const currentTip = items[activeIndex] ?? "";
  const currentTipKey = `${activeIndex}-${currentTip}`;

  useEffect(() => {
    const nextTip = { key: currentTipKey, text: currentTip };
    const previousTip = previousTipRef.current;
    previousTipRef.current = nextTip;

    if (!previousTip || previousTip.key === nextTip.key) {
      return;
    }

    setExitingTip(previousTip);
    const timeout = window.setTimeout(() => {
      setExitingTip((tip) => (tip?.key === previousTip.key ? null : tip));
    }, TIP_TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [currentTip, currentTipKey]);

  if (!isMounted || items.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)} aria-live="polite">
      <div className="flex items-start gap-3 sm:items-center">
        <span className="mono-label mt-0.5 shrink-0 text-primary sm:mt-0">
          {label}
        </span>
        <div className="relative min-h-10 min-w-0 flex-1 sm:min-h-5">
          {exitingTip && exitingTip.key !== currentTipKey ? (
            <p
              key={exitingTip.key}
              aria-hidden
              className="header-tips-ticker-exit absolute inset-x-0 top-0 text-sm leading-snug text-muted-foreground sm:truncate"
            >
              {exitingTip.text}
            </p>
          ) : null}
          <p
            key={currentTipKey}
            className="header-tips-ticker-enter text-sm leading-snug text-muted-foreground sm:truncate"
          >
            {currentTip}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setActiveIndex((current) => (current + 1) % items.length)
          }
          aria-label={skipLabel}
          className="mt-0.5 h-auto shrink-0 gap-1 px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary sm:mt-0"
        >
          <SkipForwardIcon className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">{skipLabel}</span>
        </Button>
      </div>
      <Progress
        value={progress * 100}
        aria-label={`${skipLabel} progress`}
        className="mt-2.5 h-0.5 bg-border"
      />
    </div>
  );
}
