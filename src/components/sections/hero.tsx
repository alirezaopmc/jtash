import { profile } from "@/content/profile";
import type { View } from "@/content/types";

type HeroProps = {
  view: View;
  caret?: boolean;
};

export function Hero({ view, caret = true }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex h-[calc(100svh-var(--statusline-h))] flex-col px-6 pt-[38svh] sm:px-10"
      id="hero"
    >
      <h1
        className="max-w-[16ch] text-balance font-medium text-[clamp(2.5rem,6vw,5.5rem)] text-foreground leading-[1.08]"
        id="hero-title"
      >
        {profile.valueLine[view]}
        {caret ? (
          <span aria-hidden="true" className="text-foreground">
            ▍
          </span>
        ) : null}
      </h1>
    </section>
  );
}
