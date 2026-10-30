"use client";

import type { OrbitTokensRaw } from "@manovaspace/tokens";
import {
  ThemeColorSync,
  ThemeProvider,
  Toaster,
  TokenProvider,
} from "@manovaspace/ui";
import type { ReactNode } from "react";

import { claudeCodeTokens } from "@/theme/claude-code";

type ProvidersProps = {
  children: ReactNode;
  /** Server-resolved tokens, so the first paint is already branded. */
  initialTokens: OrbitTokensRaw;
};

/**
 * Canonical Manova provider stack.
 * TokenProvider must wrap ThemeProvider so semantic variables exist before the
 * `.dark` class toggles. Mount exactly one Toaster for the whole app.
 *
 * Brand palette: `claude-code.ts` (light source + type + radii) with dark
 * surface corrections in `claude-code.css`.
 */
export function Providers({ children, initialTokens }: ProvidersProps) {
  return (
    <TokenProvider initialTokens={initialTokens} tokens={claudeCodeTokens}>
      <ThemeProvider
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
      >
        <ThemeColorSync />
        {children}
        <Toaster />
      </ThemeProvider>
    </TokenProvider>
  );
}
