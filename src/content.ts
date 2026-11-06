// All copy lives here. Components read from this file only.

export const identity = {
  name: "Alireza Jafartash",
  role: "Technical Product Manager",
  path: "~/jtash/portfolio",
};

export const slogan = {
  line1: "AI knows as much",
  line2: "as ",
  emphasis: "you.",
};

export const placeholderPrompt = 'Try "scroll down"';

export type LandingSection =
  | "hero"
  | "capabilities"
  | "experience"
  | "education";

/** The three pillars, in scroll order. Colors come from the CLI's own palette. */
export const pillars = [
  {
    key: "systems",
    discipline: "backend",
    word: "trust",
    subject: "systems",
    color: "var(--color-trust)",
    meaning: "Trust is when nobody notices the storm.",
    moreHref: "#backend",
    moreLabel: "more about backend",
  },
  {
    key: "product",
    discipline: "product",
    word: "clarity",
    subject: "products",
    color: "var(--color-clarity)",
    meaning: "Clarity is choosing the one problem worth solving.",
    moreHref: "#product",
    moreLabel: "more about product",
  },
  {
    key: "frontend",
    discipline: "frontend",
    word: "feeling",
    subject: "applications",
    color: "var(--color-feeling)",
    meaning: "Feeling is the sum of a hundred small decisions.",
    moreHref: "#frontend",
    moreLabel: "more about frontend",
  },
] as const;
