"use client";

import { MarkdownContent } from "@orbit/markdown";
import { Button } from "@orbit/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BackLink } from "@/components/layout/back-link";
import type { BlogPost, SiteRoutes, UiLabels } from "@/types/content";

export interface BlogPostViewProps {
  post: BlogPost;
  prev?: BlogPost;
  next?: BlogPost;
  labels: UiLabels["blog"];
  routes: SiteRoutes;
}

export function BlogPostView({
  post,
  prev,
  next,
  labels,
  routes,
}: BlogPostViewProps) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-24 lg:px-12">
      <div className="mb-8">
        <BackLink href={routes.blog}>{labels.backLink}</BackLink>
      </div>

      <header className="mb-12 border-b border-border pb-8">
        <p className="mono-label mb-4 text-muted-foreground">{post.date}</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {post.summary}
        </p>
      </header>

      <MarkdownContent className="prose-arch" content={post.content} />

      {(prev || next) && (
        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-8">
          {prev ? (
            <Button
              asChild
              variant="link"
              className="h-auto p-0 text-muted-foreground hover:text-primary"
            >
              <a
                href={`${routes.blog}/${prev.slug}`}
                className="group inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {prev.title}
              </a>
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button
              asChild
              variant="link"
              className="h-auto p-0 text-muted-foreground hover:text-primary"
            >
              <a
                href={`${routes.blog}/${next.slug}`}
                className="group inline-flex items-center gap-2 text-right"
              >
                {next.title}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
