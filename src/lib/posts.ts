import { getCollection } from "astro:content";

/** Published posts, newest first. Drafts are hidden only in production builds. */
export async function getPublishedPosts() {
  const posts = await getCollection(
    "posts",
    (post) => !(import.meta.env.PROD && post.data.draft),
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Reading time in whole minutes at 220 words per minute, minimum 1. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

/** e.g. "23 Nov 2026". Formatted in UTC so date-only frontmatter does not shift a day. */
export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
