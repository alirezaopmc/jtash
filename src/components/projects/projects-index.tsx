"use client";

import { SectionHeader } from "@/components/layout/section-header";
import type {
  CaseStudy,
  SectionMeta,
  SiteRoutes,
  UiLabels,
} from "@/types/content";
import { CaseStudiesSection } from "../sections/case-studies-section";

export interface ProjectsIndexProps {
  items: CaseStudy[];
  meta: SectionMeta;
  labels: UiLabels;
  routes: SiteRoutes;
}

export function ProjectsIndex({
  items,
  meta,
  labels,
  routes,
}: ProjectsIndexProps) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-24 lg:px-12">
        <SectionHeader
          number={meta.number}
          title={meta.title}
          meta={meta.meta}
        />
      </section>
      <CaseStudiesSection
        items={items}
        meta={meta}
        routes={routes}
        labels={labels.projects}
        showHeader={false}
      />
    </>
  );
}
