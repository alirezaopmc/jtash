import blogPostsData from "@/content/data/blog-posts.json";
import caseStudiesData from "@/content/data/case-studies.json";
import educationData from "@/content/data/education.json";
import educationTimelineData from "@/content/data/education-timeline.json";
import experienceData from "@/content/data/experience.json";
import experienceTimelineData from "@/content/data/experience-timeline.json";
import navigationData from "@/content/data/navigation.json";
import profileData from "@/content/data/profile.json";
import quickScanSpecData from "@/content/data/quick-scan-spec.json";
import sectionsData from "@/content/data/sections.json";
import sideProjectsData from "@/content/data/side-projects.json";
import siteData from "@/content/data/site.json";
import skillsData from "@/content/data/skills.json";
import testimonialsData from "@/content/data/testimonials.json";
import tipsData from "@/content/data/tips.json";
import uiLabelsData from "@/content/data/ui-labels.json";
import type {
  BlogPost,
  CaseStudy,
  EducationTimeline,
  ExperienceTimeline,
  SiteContent,
  SkillNode,
} from "@/types/content";

/** Synchronous snapshot for Storybook, tests, and local JSON-backed reads. */
export const siteContentFixture: SiteContent = {
  site: siteData,
  navigation: navigationData,
  headerTips: tipsData,
  sections: sectionsData,
  labels: uiLabelsData,
  profile: profileData,
  quickScanSpec: quickScanSpecData,
  education: educationData,
  educationTimeline: educationTimelineData as unknown as EducationTimeline,
  sideProjects: sideProjectsData,
  experience: experienceData,
  experienceTimeline: experienceTimelineData as ExperienceTimeline,
  caseStudies: caseStudiesData,
  skills: skillsData as SkillNode,
  testimonials: testimonialsData,
};

export const blogPostsFixture: BlogPost[] = blogPostsData;
export const caseStudiesFixture: CaseStudy[] = caseStudiesData;
