"use client";

import { Button, cn } from "@orbit/ui";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";
import type { UiLabels } from "@/types/content";

export interface ThemeToggleProps {
  labels: UiLabels["theme"];
}

const themeOptions = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

type ThemeOption = (typeof themeOptions)[number]["value"];

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const menuId = useId();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0"
        aria-hidden
        tabIndex={-1}
      />
    );
  }

  const activeTheme = (theme ?? "system") as ThemeOption;
  const resolvedIcon =
    resolvedTheme === "dark" ? Moon : resolvedTheme === "light" ? Sun : Monitor;
  const TriggerIcon =
    themeOptions.find((option) => option.value === activeTheme)?.icon ??
    resolvedIcon;

  const labelByValue: Record<ThemeOption, string> = {
    light: labels.light,
    dark: labels.dark,
    system: labels.system,
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground hover:text-primary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={labels.toggle}
        onClick={() => setOpen((current) => !current)}
      >
        <TriggerIcon className="h-4 w-4" aria-hidden />
      </Button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={labels.toggle}
          className="absolute top-full right-0 z-50 mt-2 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {themeOptions.map(({ value, icon: Icon }) => {
            const isActive = activeTheme === value;

            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="flex-1 text-left">{labelByValue[value]}</span>
                {isActive ? (
                  <Check className="h-4 w-4 shrink-0" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
