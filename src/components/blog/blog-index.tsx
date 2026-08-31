"use client";

import { Button } from "@manovaspace/ui";
import { motion } from "framer-motion";
import { ArrowRightIcon, CalendarIcon } from "@manovaspace/ui";
import { SectionHeader } from "@/components/layout/section-header";
import {
  fadeUp,
  scrollRevealViewport,
  staggerDelay,
  transitionBase,
} from "@manovaspace/ui/motion";
import type { BlogPost, SiteRoutes, UiLabels } from "@/types/content";

export interface BlogIndexProps {
  posts: BlogPost[];
  labels: UiLabels["blog"];
  routes: SiteRoutes;
}

export function BlogIndex({ posts, labels, routes }: BlogIndexProps) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 lg:px-12">
      <SectionHeader
        number={labels.number}
        title={labels.title}
        meta={`${posts.length} ${labels.entriesSuffix}`}
        className="mb-12"
      />

      <div className="space-y-0">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={scrollRevealViewport}
            transition={{ ...transitionBase, delay: staggerDelay(index) }}
          >
            <a
              href={`${routes.blog}/${post.slug}`}
              className="group -mx-4 block border-b border-border px-4 py-8 transition-colors duration-200 hover:bg-card/50"
            >
              <div className="mb-3 flex items-center gap-2">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="mono-label text-muted-foreground">
                  {post.date}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {post.summary}
              </p>
              <Button
                asChild
                variant="link"
                className="mt-4 h-auto p-0 mono-label text-muted-foreground group-hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  {labels.readArticle}
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Button>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
