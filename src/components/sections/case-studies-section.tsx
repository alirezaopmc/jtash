"use client";

import { ArrowRightIcon, motion } from "@manovaspace/ui";
import {
  fadeUp,
  scrollRevealViewport,
  staggerDelay,
  transitionBase,
} from "@manovaspace/ui/motion";
import { SectionHeader } from "@/components/layout/section-header";
import type {
  CaseStudy,
  SectionMeta,
  SiteRoutes,
  UiLabels,
} from "@/types/content";
import { StoryMetricBadge } from "../story/story-metric-badge";
import { StorySection } from "../story/story-section";
import { StoryTexture } from "../story/story-texture";

export interface CaseStudiesSectionProps {
  items: CaseStudy[];
  meta: SectionMeta;
  routes: SiteRoutes;
  labels: UiLabels["projects"];
  showHeader?: boolean;
}

export function CaseStudiesSection({
  items,
  meta,
  routes,
  labels,
  showHeader = true,
}: CaseStudiesSectionProps) {
  return (
    <StorySection id={meta.anchor} band="blueprint" fullBleed>
      {showHeader ? (
        <SectionHeader
          number={meta.number}
          title={meta.title}
          meta={meta.meta}
        />
      ) : null}
      <StoryTexture variant="blueprint">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((study, index) => (
            <motion.div
              key={study.slug}
              initial={fadeUp.initial}
              whileInView={fadeUp.animate}
              viewport={scrollRevealViewport}
              transition={{ ...transitionBase, delay: staggerDelay(index) }}
              className="relative border border-band-blueprint/15 bg-card/90 p-8"
            >
              <a
                href={`${routes.projects}/${study.slug}`}
                className="group block"
              >
                <div className="mono-label absolute right-4 top-4 text-band-blueprint-muted/50">
                  {labels.drawingPrefix}
                  {String(index + 1).padStart(3, "0")}
                </div>
                <h3 className="pr-16 text-xl font-semibold text-foreground group-hover:text-primary">
                  {study.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {study.short}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {study.metrics.slice(0, 2).map((metric) => (
                    <StoryMetricBadge key={metric.label} variant="blueprint">
                      {metric.label}: {metric.value}
                    </StoryMetricBadge>
                  ))}
                </div>
                <ArrowRightIcon className="mt-4 h-4 w-4 text-border group-hover:text-primary" />
              </a>
            </motion.div>
          ))}
        </div>
      </StoryTexture>
    </StorySection>
  );
}
