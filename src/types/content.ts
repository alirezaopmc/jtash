export interface Profile {
  name: string;
  initials: string;
  role: string;
  tagline: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
  telegram: string;
  status: string;
  avatar: string;
  avatarAlt: string;
}

export interface QuickScanSpecItem {
  label: string;
  value: string;
}

export interface Education {
  degree: string;
  school: string;
  period?: string;
  focus: string;
  focusLabel?: string;
  thesis?: string;
  project?: string;
  note?: string;
  logo?: string;
  shortName?: string;
  timelineChar?: string;
  collapsible?: boolean;
}

export interface EducationTimelineMonth {
  year: number;
  month: number;
}

export type EducationGridDisplayMode = "initial" | "color";

export interface EducationTimelineInterval {
  name: string;
  char: string;
  color: string;
  start: EducationTimelineMonth;
  end?: EducationTimelineMonth | null;
}

export interface EducationTimeline {
  paddingMonths?: number;
  paddingTooltip?: string;
  emptyColor?: string;
  intervals: EducationTimelineInterval[];
}

export type ExperienceTimeline = EducationTimeline;

export interface SideProject {
  name: string;
  description: string;
  metric: string;
  link: string;
}

export interface StackItem {
  label: string;
  url?: string;
}

export interface CompanyProfile {
  description: string;
  website: string;
  industry?: string;
  founded?: string;
  headquarters?: string;
  facts?: string[];
}

export interface Experience {
  role: string;
  company: string;
  path: string;
  location?: string;
  period: string;
  link?: string;
  summary: string;
  timelineLabel?: string;
  highlights: string[];
  stack: StackItem[];
  technologies: StackItem[];
  logo?: string;
  accentColor?: string;
  companyProfile?: CompanyProfile;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  short: string;
  context: string;
  challenge: string;
  solution: string;
  result: string;
  stack: string[];
  metrics: CaseStudyMetric[];
}

export type SkillProficiency = "core" | "experienced" | "familiar";

export interface SkillNode {
  id: string;
  label: string;
  focus?: string;
  proficiency?: SkillProficiency;
  url?: string;
  description?: string;
  collapsible?: boolean;
  children?: SkillNode[];
}

export interface Testimonial {
  quote: string;
  author: string;
  position: string;
  profile: string;
  project: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export interface SiteMeta {
  title: string;
  description: string;
}

export interface SiteRoutes {
  home: string;
  projects: string;
  blog: string;
}

export interface FooterConfig {
  tagline: string;
  revision: string;
}

export interface SiteConfig {
  meta: SiteMeta;
  routes: SiteRoutes;
  footer: FooterConfig;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  header: NavLink[];
  contact: NavLink;
}

export interface HeaderTips {
  items: string[];
  intervalMs?: number;
}

export interface SectionMeta {
  number: string;
  title: string;
  anchor?: string;
  meta?: string;
  introLabel?: string;
  specLabel?: string;
}

export interface SectionsConfig {
  hero: SectionMeta;
  education: SectionMeta;
  sideProjects: SectionMeta;
  experience: SectionMeta;
  caseStudies: SectionMeta;
  skills: SectionMeta;
  testimonials: SectionMeta;
  projectsPage: SectionMeta;
}

export interface UiLabels {
  status: string;
  hero: {
    viewProjects: string;
    readBlog: string;
  };
  blog: {
    number: string;
    title: string;
    entriesSuffix: string;
    readArticle: string;
    backLink: string;
  };
  projects: {
    backLink: string;
    drawingPrefix: string;
  };
  caseStudy: {
    challenge: string;
    solution: string;
    result: string;
    stack: string;
  };
  education: {
    researchFocus: string;
    thesis: string;
    project: string;
    note: string;
    highlights: string;
    timelineTitle: string;
    timelineScrollHint: string;
    timelineScrollRightHint: string;
  };
  testimonials: {
    speakerIntro: string;
    project: string;
  };
  sideProjects: {
    clonePrefix: string;
  };
  experience: {
    highlights: string;
    stack: string;
    technologies: string;
    timelineTitle: string;
    timelineScrollHint: string;
    timelineScrollRightHint: string;
    details: string;
    visitCompany: string;
  };
  footer: {
    github: string;
    linkedin: string;
    telegram: string;
    email: string;
  };
  headerTips: {
    label: string;
    skip: string;
  };
  externalLink: {
    visit: string;
    copyEmail: string;
    emailCopied: string;
    copyEmailFailed: string;
    openInMail: string;
    githubDescription: string;
    linkedinDescription: string;
    telegramDescription: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
    toggle: string;
  };
}

export interface SiteContent {
  site: SiteConfig;
  navigation: NavigationConfig;
  headerTips: HeaderTips;
  sections: SectionsConfig;
  labels: UiLabels;
  profile: Profile;
  quickScanSpec: QuickScanSpecItem[];
  education: Education[];
  educationTimeline: EducationTimeline;
  sideProjects: SideProject[];
  experience: Experience[];
  experienceTimeline: ExperienceTimeline;
  caseStudies: CaseStudy[];
  skills: SkillNode;
  testimonials: Testimonial[];
}

export interface AdjacentBlogPosts {
  prev?: BlogPost;
  next?: BlogPost;
}
