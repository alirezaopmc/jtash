import { cn } from "@orbit/ui";
import type { ReactNode } from "react";

export type StoryTextureVariant =
  | "blueprint"
  | "pcb"
  | "parchment"
  | "grid"
  | "none";

export interface StoryTextureProps {
  variant?: StoryTextureVariant;
  className?: string;
  children?: ReactNode;
}

const textureClasses: Record<StoryTextureVariant, string> = {
  blueprint: "story-texture-blueprint",
  pcb: "story-texture-pcb",
  parchment: "story-texture-parchment",
  grid: "story-texture-grid",
  none: "",
};

export function StoryTexture({
  variant = "none",
  className,
  children,
}: StoryTextureProps) {
  return (
    <div className={cn("relative", textureClasses[variant], className)}>
      {children}
    </div>
  );
}
