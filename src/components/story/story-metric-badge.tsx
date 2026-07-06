import { Badge, cn } from "@orbit/ui";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const storyMetricBadgeVariants = cva("mono-label font-medium", {
  variants: {
    variant: {
      default: "border-transparent bg-transparent text-primary",
      dark: "border-transparent bg-transparent text-primary",
      accent: "rounded-full bg-primary/10 text-primary",
      blueprint:
        "rounded-md border-band-blueprint/25 bg-card/90 text-band-blueprint-muted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface StoryMetricBadgeProps
  extends Omit<ComponentProps<typeof Badge>, "variant">,
    VariantProps<typeof storyMetricBadgeVariants> {}

export function StoryMetricBadge({
  children,
  className,
  variant = "default",
  ...props
}: StoryMetricBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(storyMetricBadgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Badge>
  );
}
