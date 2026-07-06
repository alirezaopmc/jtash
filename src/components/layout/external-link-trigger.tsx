"use client";

import { cn } from "@orbit/ui";
import type { MouseEvent, ReactNode } from "react";
import { useExternalLink } from "@/components/layout/external-link-provider";
import { isExternalHref, openExternalLinkProfile } from "@/lib/external-link";
import type { ExternalLinkProfile } from "@/types/external-link";

export interface ExternalLinkTriggerProps {
  profile: ExternalLinkProfile;
  children: ReactNode;
  className?: string;
  stopPropagation?: boolean;
}

export function ExternalLinkTrigger({
  profile,
  children,
  className,
  stopPropagation = false,
}: ExternalLinkTriggerProps) {
  const context = useExternalLink();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    event.preventDefault();
    openExternalLinkProfile(profile, context?.openExternalLink);
  };

  if (!isExternalHref(profile.url)) {
    return (
      <a href={profile.url} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cn("text-left", className)}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
