"use client";

import { useTheme } from "@manovaspace/ui";
import { useEffect } from "react";

const THEME_COLORS = {
  light: "#f8fafc",
  dark: "#0b1120",
} as const;

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    const meta = document.querySelector('meta[name="theme-color"]');

    if (meta) {
      meta.setAttribute("content", THEME_COLORS[theme]);
    }
  }, [resolvedTheme]);

  return null;
}
