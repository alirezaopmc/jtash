import siteData from "@/content/data/site.json";
import {
  blogPostsFixture,
  caseStudiesFixture,
  siteContentFixture,
} from "@/content/fixtures/site-content";
import { resolveSiteContentForHost } from "@/content/services/resolve-site-content";
import type {
  AdjacentBlogPosts,
  BlogPost,
  CaseStudy,
  SiteConfig,
  SiteContent,
} from "@/types/content";

/**
 * Loads shell-level site config (meta, routes, footer).
 * Swap for an API fetch when a backend is ready.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  return siteData;
}

/**
 * Loads all homepage and shell content.
 * Swap this implementation for an API fetch when a backend is ready.
 */
export async function getSiteContent(hostname?: string): Promise<SiteContent> {
  return resolveSiteContentForHost(siteContentFixture, hostname);
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  return blogPostsFixture;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  return blogPostsFixture.find((post) => post.slug === slug);
}

export async function getAdjacentBlogPosts(
  slug: string,
): Promise<AdjacentBlogPosts> {
  const posts = await listBlogPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};

  return {
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export async function listCaseStudies(): Promise<CaseStudy[]> {
  return caseStudiesFixture;
}

export async function getCaseStudy(
  slug: string,
): Promise<CaseStudy | undefined> {
  return caseStudiesFixture.find((study) => study.slug === slug);
}
