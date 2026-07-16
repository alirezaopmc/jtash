import { cn } from "@manovaspace/ui";

export interface StoryWatermarkProps {
  src?: string;
  label?: string;
  opacity?: number;
  position?: "center" | "right" | "left";
  className?: string;
  imageClassName?: string;
}

export function StoryWatermark({
  src,
  label,
  opacity = 0.06,
  position = "center",
  className,
  imageClassName,
}: StoryWatermarkProps) {
  const positionClasses = {
    center: "items-center justify-center",
    right: "items-start justify-end pr-10 pt-1",
    left: "items-start justify-start pl-10 pt-1",
  };

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex overflow-hidden",
        positionClasses[position],
        className,
      )}
      style={{ opacity }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className={cn(
            "max-h-[55%] max-w-[28%] object-contain",
            imageClassName,
          )}
        />
      ) : label ? (
        <span className="select-none font-display text-[12rem] font-semibold leading-none text-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
}
