"use client";

import { ArrowRightIcon, ExternalLinkIcon } from "@manovaspace/ui";
import { RevealOnScroll, staggerDelay } from "@manovaspace/ui/motion";
import { SectionHeader } from "@/components/layout/section-header";
import { minimalLinkProfile } from "@/lib/external-link";
import type { SectionMeta, Testimonial, UiLabels } from "@/types/content";
import { ExternalLinkTrigger } from "../layout/external-link-trigger";
import { StorySection } from "../story/story-section";

export interface TestimonialsSectionProps {
  items: Testimonial[];
  meta: SectionMeta;
  labels: UiLabels["testimonials"];
}

const darkHeaderClass =
  "[&_h2]:text-band-dark-foreground [&_span]:text-band-dark-muted";

export function TestimonialsSection({
  items,
  meta,
  labels,
}: TestimonialsSectionProps) {
  return (
    <StorySection id={meta.anchor} band="dark" fullBleed>
      <SectionHeader
        number={meta.number}
        title={meta.title}
        meta={meta.meta}
        className={darkHeaderClass}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <RevealOnScroll key={item.author} delay={staggerDelay(index)}>
            <figure className="flex flex-col rounded-lg border border-band-dark-border bg-gradient-to-b from-band-dark to-band-dark/90 p-8">
              <p className="mono-label mb-4 tracking-[0.25em] text-primary">
                {labels.speakerIntro}
              </p>
              <blockquote className="flex-1 text-2xl font-medium leading-snug text-band-dark-foreground">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t border-band-dark-border pt-6">
                <p className="font-semibold text-band-dark-foreground">
                  {item.author}
                </p>
                <p className="mt-0.5 text-sm text-band-dark-muted">
                  {item.position}
                </p>
                <div className="mt-4 flex gap-3">
                  <ExternalLinkTrigger
                    profile={minimalLinkProfile(
                      item.author,
                      item.profile,
                      item.position,
                    )}
                    className="text-band-dark-muted hover:text-primary"
                  >
                    <ExternalLinkIcon className="h-4 w-4" aria-hidden />
                    <span className="sr-only">{item.author}</span>
                  </ExternalLinkTrigger>
                  <a
                    href={item.project}
                    className="mono-label inline-flex items-center gap-1 text-band-dark-muted hover:text-primary"
                  >
                    {labels.project}
                    <ArrowRightIcon className="h-3 w-3" />
                  </a>
                </div>
              </figcaption>
            </figure>
          </RevealOnScroll>
        ))}
      </div>
    </StorySection>
  );
}
