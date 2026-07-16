"use client";

import { cn, ToggleGroup, ToggleGroupItem } from "@manovaspace/ui";
// Fixed dev-only toolbar for toggling UI variants (e.g. education grid Letters vs
// Color). Renders only when isDevEnvironment() is true. Keep this component for
// local previews, Storybook, and agent-driven experiments — do not remove when
// hiding a specific toolbar instance in a section.
import { isDevEnvironment } from "@/lib/is-dev-environment";

export interface DevVariantOption<T extends string> {
  value: T;
  label: string;
}

export interface DevVariantToolbarProps<T extends string> {
  title: string;
  options: DevVariantOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function DevVariantToolbar<T extends string>({
  title,
  options,
  value,
  onChange,
  className,
}: DevVariantToolbarProps<T>) {
  if (!isDevEnvironment()) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[100] rounded-md border border-border bg-background/95 p-3 shadow-lg backdrop-blur-sm",
        className,
      )}
      role="toolbar"
      aria-label={title}
    >
      <p className="mono-label mb-2 text-muted-foreground">{title}</p>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange(nextValue as T);
          }
        }}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="px-2.5 py-1 text-xs data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
