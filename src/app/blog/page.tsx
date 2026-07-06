import { BlogIndex } from "@/components/blog/blog-index";
import { listBlogPosts } from "@/content/repository/content-repository";
import { getRequestSiteContent } from "@/lib/get-request-site-content";

export default async function BlogPage() {
  const [{ site, labels }, posts] = await Promise.all([
    getRequestSiteContent(),
    listBlogPosts(),
  ]);

  return <BlogIndex posts={posts} labels={labels.blog} routes={site.routes} />;
}
