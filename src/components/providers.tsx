"use client";

import {
  ThemeColorSync,
  ThemeProvider,
  Toaster,
  TokenProvider,
} from "@manovaspace/ui";
import type { ReactNode } from "react";

/**
 * Canonical Manova provider stack.
 * TokenProvider must wrap ThemeProvider so semantic variables exist before the
 * `.dark` class toggles. Mount exactly one Toaster for the whole app.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <TokenProvider>
      <ThemeProvider
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
      >
        <ThemeColorSync />
        {children}
        <Toaster />
      </ThemeProvider>
    </TokenProvider>
  );
}
