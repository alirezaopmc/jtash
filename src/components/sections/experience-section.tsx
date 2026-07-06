"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/layout/section-header";
import type {
  Experience,
  ExperienceTimeline,
  SectionMeta,
  UiLabels,
} from "@/types/content";
import { StoryExpandableList } from "../story/story-expandable-list";
import { StorySection } from "../story/story-section";
import { ExperienceActivityGrid } from "./experience/experience-activity-grid";
import { ExperienceDetailPanel } from "./experience/experience-panel";
import { ExperienceRowHeader } from "./experience/experience-row-header";

export interface ExperienceSectionProps {
  items: Experience[];
  timeline: ExperienceTimeline;
  meta: SectionMeta;
  labels: UiLabels["experience"];
}

export function ExperienceSection({
  items,
  timeline,
  meta,
  labels,
}: ExperienceSectionProps) {
  const [expandedExperienceId, setExpandedExperienceId] = useState<
    string | null
  >(null);
  const [pulseId, setPulseId] = useState<string | null>(null);

  const openExperience = (experience: Experience) => {
    const id = `${experience.company}-${experience.role}`;

    setExpandedExperienceId(id);
    setPulseId(id);
    window.setTimeout(() => setPulseId(null), 600);

    requestAnimationFrame(() => {
      document.getElementById(experience.path)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <StorySection id={meta.anchor}>
      <SectionHeader number={meta.number} title={meta.title} meta={meta.meta} />
      <ExperienceActivityGrid
        timeline={timeline}
        experiences={items}
        title={labels.timelineTitle}
        scrollHint={labels.timelineScrollHint}
        rightScrollHint={labels.timelineScrollRightHint}
        detailsLabel={labels.details}
        onDetailsClick={openExperience}
      />
      <StoryExpandableList
        expandedRowClassName="border-l-primary"
        rowClassName="relative overflow-hidden"
        items={items.map((item) => {
          const itemId = `${item.company}-${item.role}`;

          return {
            id: itemId,
            anchorId: item.path,
            ariaLabel: `Toggle ${item.role} at ${item.company}`,
            accentColor: item.accentColor,
            persistentAccent: true,
            rowClassName:
              pulseId === itemId
                ? "bg-primary/5 ring-2 ring-primary/25 transition-[background-color,box-shadow] duration-300"
                : undefined,
            header: <ExperienceRowHeader item={item} />,
            panel: <ExperienceDetailPanel item={item} labels={labels} />,
          };
        })}
        expandedId={expandedExperienceId}
        onExpandedIdChange={setExpandedExperienceId}
      />
    </StorySection>
  );
}
