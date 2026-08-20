"use client";

import { ExternalLinkIcon } from "@manovaspace/ui";

import { experienceToLinkProfile } from "@/lib/external-link";
import type { Experience } from "@/types/content";
import { ExternalLinkTrigger } from "../../layout/external-link-trigger";
import { StoryEntryHeader } from "../../story/story-entry-header";

export interface ExperienceRowHeaderProps {
  item: Experience;
}

const companyLinkClassName =
  "inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors duration-200 hover:text-primary";

function ExperienceCompanyLine({ item }: { item: Experience }) {
  const linkProfile = experienceToLinkProfile(item);
  const companyContent = linkProfile ? (
    <ExternalLinkTrigger
      profile={linkProfile}
      className={companyLinkClassName}
      stopPropagation
    >
      {item.company}
      <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </ExternalLinkTrigger>
  ) : (
    <span className="font-semibold text-foreground">{item.company}</span>
  );

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      {companyContent}
      {item.location ? (
        <span className="font-normal text-muted-foreground">
          {item.location}
        </span>
      ) : null}
    </span>
  );
}

function ExperienceRoleTitle({ item }: { item: Experience }) {
  const linkProfile = experienceToLinkProfile(item);

  if (!linkProfile) {
    return item.role;
  }

  return (
    <ExternalLinkTrigger
      profile={linkProfile}
      className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-primary"
      stopPropagation
    >
      {item.role}
      <ExternalLinkIcon
        className="h-3.5 w-3.5 shrink-0 opacity-60"
        aria-hidden
      />
    </ExternalLinkTrigger>
  );
}

export function ExperienceRowHeader({ item }: ExperienceRowHeaderProps) {
  return (
    <StoryEntryHeader
      logo={item.logo}
      logoAlt={item.company}
      title={<ExperienceRoleTitle item={item} />}
      subtitle={<ExperienceCompanyLine item={item} />}
      period={item.period}
    />
  );
}
