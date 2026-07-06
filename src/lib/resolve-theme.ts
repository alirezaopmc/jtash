export type ResolvedTheme = "dark" | "light";

export function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "dark";
}

export function resolveThemeFromStorage(stored: string | null): ResolvedTheme {
  if (stored === "light") {
    return "light";
  }

  if (stored === "dark") {
    return "dark";
  }

  if (stored === "system") {
    return resolveSystemTheme();
  }

  return "dark";
}

export function applyResolvedTheme(theme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
}
