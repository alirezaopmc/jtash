"use client";

import { useTheme } from "@manovaspace/ui";
import { useEffect } from "react";

import { applyResolvedTheme, resolveSystemTheme } from "@/lib/resolve-theme";

export function SystemThemeSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const sync = () => {
      applyResolvedTheme(resolveSystemTheme());
    };

    sync();

    const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
    const lightMq = window.matchMedia("(prefers-color-scheme: light)");

    darkMq.addEventListener("change", sync);
    lightMq.addEventListener("change", sync);

    return () => {
      darkMq.removeEventListener("change", sync);
      lightMq.removeEventListener("change", sync);
    };
  }, [theme]);

  return null;
}
