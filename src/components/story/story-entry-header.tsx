import { cn } from "@orbit/ui";
import type { ReactNode } from "react";
import { StoryEntryPeriod } from "./story-entry-period";
import { StoryInstitutionLogo } from "./story-institution-logo";

export interface StoryEntryHeaderProps {
  logo?: string;
  logoAlt: string;
  title: ReactNode;
  subtitle?: ReactNode;
  period?: string;
  className?: string;
}

export function StoryEntryHeader({
  logo,
  logoAlt,
  title,
  subtitle,
  period,
  className,
}: StoryEntryHeaderProps) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <StoryInstitutionLogo src={logo} alt={logoAlt} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
            {title}
          </h3>
          {subtitle ? (
            <div className="mt-1 text-base leading-snug text-foreground/90">
              {subtitle}
            </div>
          ) : null}
        </div>
        {period ? (
          <StoryEntryPeriod align="end">{period}</StoryEntryPeriod>
        ) : null}
      </div>
    </div>
  );
}
