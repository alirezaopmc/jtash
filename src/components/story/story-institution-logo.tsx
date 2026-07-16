import { cn } from "@manovaspace/ui";

export interface StoryInstitutionLogoProps {
  src?: string;
  alt: string;
  className?: string;
}

export function StoryInstitutionLogo({
  src,
  alt,
  className,
}: StoryInstitutionLogoProps) {
  if (!src) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-white p-2 shadow-sm",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
