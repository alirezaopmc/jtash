"use client";

import { Button, cn, Progress } from "@orbit/ui";
import { AnimatePresence, motion } from "framer-motion";
import { SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import { transitionExpand } from "@/lib/motion";

const DEFAULT_INTERVAL_MS = 10_000;

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

  if (!isMounted || items.length === 0) {
    return null;
  }

  const currentTip = items[activeIndex];

  return (
    <div className={cn("w-full", className)} aria-live="polite">
      <div className="flex items-start gap-3 sm:items-center">
        <span className="mono-label mt-0.5 shrink-0 text-primary sm:mt-0">
          {label}
        </span>
        <div className="relative min-h-10 min-w-0 flex-1 sm:min-h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${activeIndex}-${currentTip}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={transitionExpand}
              className="text-sm leading-snug text-muted-foreground sm:truncate"
            >
              {currentTip}
            </motion.p>
          </AnimatePresence>
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
          <SkipForward className="h-3.5 w-3.5" aria-hidden />
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
