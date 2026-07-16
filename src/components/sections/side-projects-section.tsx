"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { KeyboardEvent } from "react";
import { SectionHeader } from "@/components/layout/section-header";
import { hrefToHost } from "@/lib/external-link";
import {
  fadeUp,
  scrollRevealViewport,
  staggerDelay,
  transitionBase,
} from "@manovaspace/ui/motion";
import type { SectionMeta, SideProject, UiLabels } from "@/types/content";
import { useOpenExternalLink } from "../layout/external-link-provider";
import { StoryMetricBadge } from "../story/story-metric-badge";
import { StorySection } from "../story/story-section";

export interface SideProjectsSectionProps {
  items: SideProject[];
  meta: SectionMeta;
  labels: UiLabels;
}

const darkHeaderClass =
  "[&_h2]:text-band-dark-foreground [&_span]:text-band-dark-muted";

export function SideProjectsSection({
  items,
  meta,
  labels,
}: SideProjectsSectionProps) {
  const openExternalLink = useOpenExternalLink();

  const openProject = (project: SideProject) => {
    openExternalLink({
      title: project.name,
      url: project.link,
      description: project.description,
      meta: [{ label: "Metric", value: project.metric }],
    });
  };

  return (
    <StorySection id={meta.anchor} band="dark" fullBleed>
      <SectionHeader
        number={meta.number}
        title={meta.title}
        meta={meta.meta}
        className={darkHeaderClass}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((project, index) => (
          <motion.div
            key={project.name}
            role="button"
            tabIndex={0}
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={scrollRevealViewport}
            transition={{ ...transitionBase, delay: staggerDelay(index) }}
            className="group relative cursor-pointer overflow-hidden rounded-md border border-band-dark-border bg-band-dark/80 p-8 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => openProject(project)}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProject(project);
              }
            }}
          >
            <div className="mb-4 flex gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-period-accent/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
              <span className="mono-label ml-2 text-band-dark-muted">
                {project.name.toLowerCase()}.ts
              </span>
            </div>
            <div className="absolute top-6 right-6">
              <StoryMetricBadge variant="dark">
                {project.metric}
              </StoryMetricBadge>
            </div>
            <h3 className="mb-3 pr-20 font-mono text-xl font-semibold text-primary">
              {project.name}
            </h3>
            <p className="mb-8 max-w-sm font-mono text-sm leading-relaxed text-band-dark-muted">
              {project.description}
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-band-dark-muted group-hover:text-primary">
              {labels.sideProjects.clonePrefix}
              <span className="sr-only">{hrefToHost(project.link)}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </div>
          </motion.div>
        ))}
      </div>
    </StorySection>
  );
}
