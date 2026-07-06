"use client";

import { SectionHeader } from "@/components/layout/section-header";
import { resolveEducationIntervalColor } from "@/lib/education-timeline-grid";
import type {
  Education,
  EducationTimeline,
  SectionMeta,
  UiLabels,
} from "@/types/content";
import { StoryEntryHeader } from "../story/story-entry-header";
import { StoryExpandableList } from "../story/story-expandable-list";
import { StorySection } from "../story/story-section";
import { EducationActivityGrid } from "./education/education-activity-grid";
import { EducationFocusPanel } from "./education/education-panel";

export interface EducationSectionProps {
  items: Education[];
  timeline: EducationTimeline;
  meta: SectionMeta;
  labels: UiLabels["education"];
}

export function EducationSection({
  items,
  timeline,
  meta,
  labels,
}: EducationSectionProps) {
  return (
    <StorySection id={meta.anchor} band="elevated" fullBleed>
      <SectionHeader number={meta.number} title={meta.title} meta={meta.meta} />
      <EducationActivityGrid
        timeline={timeline}
        title={labels.timelineTitle}
        scrollHint={labels.timelineScrollHint}
        rightScrollHint={labels.timelineScrollRightHint}
      />
      <StoryExpandableList
        expandedRowClassName="border-l-primary"
        rowClassName="relative overflow-hidden"
        items={items.map((item) => ({
          id: item.degree,
          alwaysExpanded: !item.collapsible,
          expandOnHover: item.collapsible,
          persistentAccent: true,
          accentColor: resolveEducationIntervalColor(
            timeline,
            item.timelineChar,
          ),
          hideToggle: item.collapsible,
          ariaLabel: `Expand ${item.degree} details`,
          header: (
            <StoryEntryHeader
              logo={item.logo}
              logoAlt={item.school}
              title={item.degree}
              subtitle={item.school}
              period={item.period}
            />
          ),
          panel: <EducationFocusPanel item={item} labels={labels} />,
        }))}
      />
    </StorySection>
  );
}
