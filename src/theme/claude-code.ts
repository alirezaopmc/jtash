import type { OrbitTokenOverride } from "@manovaspace/tokens";

/**
 * Claude Code brand palette.
 *
 * Light scheme is authored here and becomes the token system's source of
 * truth. The dark scheme is derived by the token resolver (HSL L inversion),
 * which cannot express a designed warm-charcoal surface stack, so the tokens
 * where that inversion is wrong are corrected in `claude-code.css` under
 * `html.dark`.
 *
 * Roles: warm charcoal ground, cream ink, clay accent (primary), sage for the
 * active state block. No blue anywhere.
 */
export const claudeCodeTokens: OrbitTokenOverride = {
  semantic: {
    light: {
      background: "#efede6",
      foreground: "#1f1e1d",
      card: "#f7f5f0",
      "card-foreground": "#1f1e1d",
      popover: "#fbfaf6",
      "popover-foreground": "#1f1e1d",
      primary: "#d97757",
      "primary-foreground": "#1f1e1d",
      secondary: "#e4e1d6",
      "secondary-foreground": "#1f1e1d",
      muted: "#e4e1d6",
      "muted-foreground": "#6b665c",
      accent: "#dcd8cc",
      "accent-foreground": "#1f1e1d",
      destructive: "#b4432f",
      "destructive-foreground": "#f0eee6",
      border: "#d5d1c4",
      input: "#d5d1c4",
      ring: "#d97757",
      "surface-sunken": "#e7e4da",
      sidebar: "#e9e6dd",
      "sidebar-foreground": "#1f1e1d",
      "sidebar-primary": "#d97757",
      "sidebar-primary-foreground": "#1f1e1d",
      "sidebar-accent": "#dcd8cc",
      "sidebar-accent-foreground": "#1f1e1d",
      "sidebar-border": "#d5d1c4",
      "sidebar-ring": "#d97757",
      "chart-1": "#d97757",
      "chart-2": "#5f7f4e",
      "chart-3": "#6b665c",
      "chart-4": "#a9642f",
      "chart-5": "#8f8a7f",
      "status-success": "#8fbf7f",
      "status-success-foreground": "#0e0d0c",
      "status-warning": "#e0a15c",
      "status-warning-foreground": "#1f1e1d",
      "status-danger": "#d9544a",
      "status-danger-foreground": "#1f1e1d",
    },
  },
  typography: {
    fontFamily: {
      // Content stays proportional; the pairing is still an open question.
      sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      // Chrome — statusline, command line, IDs — is the tool voice.
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    lineHeight: {
      tight: "1.15",
      normal: "1.5",
      relaxed: "1.65",
    },
  },
  radii: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.375rem",
    xl: "0.5rem",
  },
};
