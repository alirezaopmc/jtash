"use client";

import { cn } from "@orbit/ui";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const SCROLL_EDGE_THRESHOLD_PX = 4;

export interface TimelineScrollContainerProps {
  children: ReactNode;
  className?: string;
  scrollHint: string;
  rightScrollHint: string;
  /** Tailwind `from-*` class matching the section surface behind the fade. */
  fadeFromClassName?: string;
  onMouseLeave?: () => void;
}

export function TimelineScrollContainer({
  children,
  className,
  scrollHint,
  rightScrollHint,
  fadeFromClassName = "from-background",
  onMouseLeave,
}: TimelineScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftHint, setShowLeftHint] = useState(false);
  const [showRightHint, setShowRightHint] = useState(false);

  const updateScrollHints = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const hasOverflow = element.scrollWidth > element.clientWidth + 1;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const canScrollLeft = element.scrollLeft > SCROLL_EDGE_THRESHOLD_PX;
    const canScrollRight =
      maxScroll - element.scrollLeft > SCROLL_EDGE_THRESHOLD_PX;

    setShowLeftHint(hasOverflow && canScrollLeft);
    setShowRightHint(hasOverflow && canScrollRight);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const scrollToEnd = () => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      if (maxScroll > 0) {
        element.scrollLeft = maxScroll;
      }
      updateScrollHints();
    };

    scrollToEnd();

    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(element);

    return () => observer.disconnect();
  }, [updateScrollHints]);

  return (
    <div className="relative min-w-0">
      <div
        ref={scrollRef}
        className={cn("overflow-x-auto py-2", className)}
        onScroll={updateScrollHints}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
      <div
        className={cn(
          "pointer-events-none absolute bottom-2 left-0 top-0 z-10 hidden w-16 bg-gradient-to-r to-transparent transition-opacity duration-200 max-lg:block",
          fadeFromClassName,
          showLeftHint ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 transition-opacity duration-200 max-lg:block",
          showLeftHint ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      >
        <span className="mono-label text-[10px] font-medium text-foreground/55">
          {scrollHint}
        </span>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute bottom-2 right-0 top-0 z-10 hidden w-16 bg-gradient-to-l to-transparent transition-opacity duration-200 max-lg:block",
          fadeFromClassName,
          showRightHint ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 transition-opacity duration-200 max-lg:block",
          showRightHint ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      >
        <span className="mono-label text-[10px] font-medium text-foreground/55">
          {rightScrollHint}
        </span>
      </div>
    </div>
  );
}
