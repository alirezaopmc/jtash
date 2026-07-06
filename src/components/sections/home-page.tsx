"use client";

import { useSectionScrollSpy } from "@/lib/use-section-scroll-spy";
import type { SiteContent } from "@/types/content";
import { CaseStudiesSection } from "./case-studies-section";
import { EducationSection } from "./education-section";
import { ExperienceSection } from "./experience-section";
import { HeroSection } from "./hero-section";
import { SideProjectsSection } from "./side-projects-section";
import { SkillsSection } from "./skills-section";
import { TestimonialsSection } from "./testimonials-section";

export interface HomePageProps {
  site: SiteContent["site"];
  sections: SiteContent["sections"];
  labels: SiteContent["labels"];
  profile: SiteContent["profile"];
  quickScanSpec: SiteContent["quickScanSpec"];
  education: SiteContent["education"];
  educationTimeline: SiteContent["educationTimeline"];
  sideProjects: SiteContent["sideProjects"];
  experience: SiteContent["experience"];
  experienceTimeline: SiteContent["experienceTimeline"];
  caseStudies: SiteContent["caseStudies"];
  skills: SiteContent["skills"];
  testimonials: SiteContent["testimonials"];
}

export function HomePage({
  site,
  sections,
  labels,
  profile,
  quickScanSpec,
  education,
  educationTimeline,
  sideProjects,
  experience,
  experienceTimeline,
  caseStudies,
  skills,
  testimonials,
}: HomePageProps) {
  const { routes } = site;
  const sectionAnchors = [
    sections.hero.anchor,
    sections.education.anchor,
    sections.sideProjects.anchor,
    sections.experience.anchor,
    sections.caseStudies.anchor,
    sections.skills.anchor,
    sections.testimonials.anchor,
  ].filter((anchor): anchor is string => Boolean(anchor));

  useSectionScrollSpy(sectionAnchors);

  return (
    <>
      <HeroSection
        profile={profile}
        quickScanSpec={quickScanSpec}
        meta={sections.hero}
        labels={labels}
        routes={routes}
      />
      <EducationSection
        items={education}
        timeline={educationTimeline}
        meta={sections.education}
        labels={labels.education}
      />
      <SideProjectsSection
        items={sideProjects}
        meta={sections.sideProjects}
        labels={labels}
      />
      <ExperienceSection
        items={experience}
        timeline={experienceTimeline}
        meta={sections.experience}
        labels={labels.experience}
      />
      <CaseStudiesSection
        items={caseStudies}
        meta={sections.caseStudies}
        routes={routes}
        labels={labels.projects}
      />
      <SkillsSection tree={skills} meta={sections.skills} />
      <TestimonialsSection
        items={testimonials}
        meta={sections.testimonials}
        labels={labels.testimonials}
      />
    </>
  );
}
