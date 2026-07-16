import { cn } from "@manovaspace/ui";

export interface SectionHeaderProps {
  number: string;
  title: string;
  meta?: string;
  className?: string;
}

export function SectionHeader({
  number,
  title,
  meta,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 flex items-end justify-between border-b border-border pb-4",
        className,
      )}
    >
      <div className="flex items-baseline gap-4">
        <span className="mono-label text-primary">{number}</span>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
      </div>
      {meta ? (
        <span className="mono-label hidden text-muted-foreground md:block">
          {meta}
        </span>
      ) : null}
    </div>
  );
}
