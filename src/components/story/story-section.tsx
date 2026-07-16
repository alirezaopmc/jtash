import { cn } from "@manovaspace/ui";
import type { ReactNode } from "react";

export type StorySectionBand =
  | "light"
  | "dark"
  | "elevated"
  | "parchment"
  | "blueprint";

export interface StorySectionProps {
  children: ReactNode;
  className?: string;
  band?: StorySectionBand;
  id?: string;
  fullBleed?: boolean;
}

const bandClasses: Record<StorySectionBand, string> = {
  light: "bg-transparent",
  dark: "bg-band-dark text-band-dark-foreground",
  elevated: "bg-band-elevated story-texture-grid",
  parchment: "bg-band-parchment story-texture-parchment",
  blueprint: "bg-band-blueprint-surface story-texture-blueprint",
};

export function StorySection({
  children,
  className,
  band = "light",
  id,
  fullBleed = false,
}: StorySectionProps) {
  const sectionClassName = cn(
    id && "scroll-mt-32",
    bandClasses[band],
    className,
  );

  if (fullBleed) {
    return (
      <section
        id={id}
        className={sectionClassName}
        data-story-band={band === "light" ? undefined : band}
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">{children}</div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-7xl px-6 py-24 lg:px-12", sectionClassName)}
      data-story-band={band === "light" ? undefined : band}
    >
      {children}
    </section>
  );
}
