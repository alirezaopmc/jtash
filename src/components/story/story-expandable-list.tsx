"use client";

import { Button, cn } from "@orbit/ui";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { type CSSProperties, type ReactNode, useState } from "react";
import { transitionExpand } from "@orbit/ui/motion";

export interface StoryExpandableItem {
  id: string;
  anchorId?: string;
  header: ReactNode;
  panel: ReactNode;
  ariaLabel?: string;
  alwaysExpanded?: boolean;
  expandOnHover?: boolean;
  persistentAccent?: boolean;
  hideToggle?: boolean;
  rowClassName?: string;
  accentColor?: string;
}

export interface StoryExpandableListProps {
  items: StoryExpandableItem[];
  className?: string;
  rowClassName?: string;
  expandedRowClassName?: string;
  /** @deprecated Prefer per-item `alwaysExpanded` */
  alwaysExpanded?: boolean;
  /** Controlled expanded item id. When set, the list will not manage its own expanded state. */
  expandedId?: string | null;
  /** Callback for updating controlled `expandedId`. Also used for hover expansion when controlled. */
  onExpandedIdChange?: (id: string | null) => void;
}

export function StoryExpandableList({
  items,
  className,
  rowClassName,
  expandedRowClassName = "border-l-primary bg-card",
  alwaysExpanded = false,
  expandedId,
  onExpandedIdChange,
}: StoryExpandableListProps) {
  const isControlled = expandedId !== undefined;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const setExpanded = (next: number | null) => {
    if (!isControlled) {
      setExpandedIndex(next);
      return;
    }

    // In controlled mode we store by item id, not index.
    if (next === null) {
      onExpandedIdChange?.(null);
      return;
    }
    onExpandedIdChange?.(items[next]?.id ?? null);
  };

  return (
    <div className={cn("border-t border-border", className)}>
      {items.map((item, index) => {
        const isAlwaysExpanded = item.alwaysExpanded ?? alwaysExpanded ?? false;
        const isExpanded = isAlwaysExpanded
          ? true
          : isControlled
            ? expandedId === item.id
            : expandedIndex === index;
        const isDimmed =
          !isAlwaysExpanded &&
          expandedIndex !== null &&
          expandedIndex !== index;
        const showAccent = item.persistentAccent || isExpanded;
        const isClickExpandable =
          !isAlwaysExpanded && !item.expandOnHover && !item.hideToggle;
        const rowStyle: CSSProperties | undefined =
          showAccent && item.accentColor
            ? { borderLeftColor: item.accentColor }
            : undefined;

        const toggleExpanded = () => {
          setExpanded(isExpanded ? null : index);
        };

        return (
          <div
            key={item.id}
            id={item.anchorId}
            style={rowStyle}
            className={cn(
              "relative border-b border-border border-l-2 transition-opacity duration-300",
              item.anchorId && "scroll-mt-32",
              showAccent
                ? item.accentColor
                  ? "border-l-[length:2px]"
                  : expandedRowClassName
                : "border-l-transparent",
              isDimmed ? "opacity-45" : "opacity-100",
              isClickExpandable && "cursor-pointer",
              rowClassName,
              item.rowClassName,
            )}
            onMouseEnter={() => {
              if (item.expandOnHover) setExpanded(index);
            }}
            onMouseLeave={() => {
              if (item.expandOnHover) setExpanded(null);
            }}
            onClick={() => {
              if (isClickExpandable) toggleExpanded();
            }}
            onKeyDown={(event) => {
              if (!isClickExpandable) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleExpanded();
              }
            }}
            role={isClickExpandable ? "button" : undefined}
            tabIndex={isClickExpandable ? 0 : undefined}
            aria-expanded={isClickExpandable ? isExpanded : undefined}
          >
            <div className="flex items-start gap-3 py-6 pl-6 pr-4">
              <div className="relative z-10 min-w-0 flex-1">{item.header}</div>
              {!isAlwaysExpanded && !item.hideToggle ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleExpanded();
                  }}
                  aria-expanded={isExpanded}
                  aria-label={item.ariaLabel}
                  className="relative z-10 mt-1 shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isExpanded && "rotate-180 text-primary",
                    )}
                  />
                </Button>
              ) : null}
            </div>
            {isAlwaysExpanded ? (
              <div className="relative z-10 overflow-hidden">{item.panel}</div>
            ) : (
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={transitionExpand}
                    className="relative z-10 overflow-hidden"
                  >
                    {item.panel}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
