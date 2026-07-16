"use client";

import { Button, cn } from "@manovaspace/ui";
import { AnimatePresence, motion } from "framer-motion";
import { experienceToLinkProfile } from "@/lib/external-link";
import { duration, easeOut, transitionFast, useReducedMotion } from "@manovaspace/ui/motion";
import type { Experience } from "@/types/content";
import { useOpenExternalLink } from "../../layout/external-link-provider";
import { StackTag } from "../../stack-tag";
import { StoryInstitutionLogo } from "../../story/story-institution-logo";

export interface ExperienceTimelineDisplayProps {
  experience: Experience;
  detailsLabel: string;
  onDetailsClick?: (experience: Experience) => void;
  heightPx?: number;
  className?: string;
}

function TimelinePanelBody({
  experience,
  detailsLabel,
  onDetailsClick,
  onOpenCompanyModal,
  canOpenCompanyModal,
}: {
  experience: Experience;
  detailsLabel: string;
  onDetailsClick?: (experience: Experience) => void;
  onOpenCompanyModal: () => void;
  canOpenCompanyModal: boolean;
}) {
  const topStack = experience.stack[0];

  return (
    <div className="flex h-full min-w-0 flex-col gap-3">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold leading-tight text-foreground">
            {experience.role}
          </p>

          <p className="mt-1.5 truncate text-sm text-muted-foreground">
            {experience.timelineLabel ?? experience.summary}
          </p>

          <div className="mt-2.5">
            {topStack ? (
              <StackTag href={topStack.url} className="rounded-md">
                {topStack.label}
              </StackTag>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className={cn(
            "group flex w-[7.5rem] shrink-0 flex-col items-center rounded-md text-center",
            canOpenCompanyModal &&
              "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
          )}
          onClick={onOpenCompanyModal}
          disabled={!canOpenCompanyModal}
          aria-label={
            canOpenCompanyModal ? `About ${experience.company}` : undefined
          }
        >
          {experience.logo ? (
            <StoryInstitutionLogo
              src={experience.logo}
              alt={experience.company}
              className={cn(
                "h-[4.5rem] w-[4.5rem] transition-[border-color,box-shadow] duration-200",
                canOpenCompanyModal &&
                  "group-hover:border-primary/60 group-hover:shadow-md",
              )}
            />
          ) : (
            <div
              className="h-[4.5rem] w-[4.5rem] rounded-md bg-muted"
              aria-hidden
            />
          )}
          <span
            className={cn(
              "mt-2 w-full truncate font-display text-sm font-semibold leading-tight text-foreground",
              canOpenCompanyModal &&
                "transition-colors duration-200 group-hover:text-primary",
            )}
          >
            {experience.company}
          </span>
          <span className="mt-0.5 w-full truncate text-xs text-muted-foreground">
            {experience.location ?? "\u00A0"}
          </span>
        </button>
      </div>

      <Button
        type="button"
        variant="link"
        className="mt-auto h-auto justify-start p-0 text-sm font-medium text-foreground underline-offset-4"
        onClick={() => onDetailsClick?.(experience)}
      >
        {detailsLabel}
      </Button>
    </div>
  );
}

export function ExperienceTimelineDisplay({
  experience,
  detailsLabel,
  onDetailsClick,
  heightPx,
  className,
}: ExperienceTimelineDisplayProps) {
  const openExternalLink = useOpenExternalLink();
  const reducedMotion = useReducedMotion();
  const linkProfile = experienceToLinkProfile(experience);
  const canOpenCompanyModal = linkProfile != null;

  const openCompanyModal = () => {
    if (linkProfile) {
      openExternalLink(linkProfile);
    }
  };

  const panelTransition = reducedMotion
    ? { duration: 0 }
    : { ...transitionFast, duration: duration.fast + 0.03, ease: easeOut };

  return (
    <div
      className={cn(
        "box-border rounded-lg border border-y border-r border-border/80 bg-card p-5",
        heightPx != null && "h-full overflow-hidden",
        className,
      )}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: experience.accentColor ?? "hsl(var(--primary))",
        ...(heightPx != null ? { height: heightPx } : {}),
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={experience.path}
          initial={reducedMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
          transition={panelTransition}
          className="h-full"
        >
          <TimelinePanelBody
            experience={experience}
            detailsLabel={detailsLabel}
            onDetailsClick={onDetailsClick}
            onOpenCompanyModal={openCompanyModal}
            canOpenCompanyModal={canOpenCompanyModal}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
