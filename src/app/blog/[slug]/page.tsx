import { notFound } from "next/navigation";

import { BlogPostView } from "@/components/blog/blog-post";
import {
  getAdjacentBlogPosts,
  getBlogPost,
  listBlogPosts,
} from "@/content/repository/content-repository";
import { getRequestSiteContent } from "@/lib/get-request-site-content";

export async function generateStaticParams() {
  const posts = await listBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ site, labels }, post] = await Promise.all([
    getRequestSiteContent(),
    getBlogPost(slug),
  ]);

  if (!post) {
    notFound();
  }

  const { prev, next } = await getAdjacentBlogPosts(slug);

  return (
    <BlogPostView
      post={post}
      prev={prev}
      next={next}
      labels={labels.blog}
      routes={site.routes}
    />
  );
}
