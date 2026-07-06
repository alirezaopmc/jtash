"use client";

import { useHostAwareProfile } from "@/lib/use-host-aware-profile";
import type {
  Profile,
  QuickScanSpecItem,
  SectionMeta,
  SiteRoutes,
  UiLabels,
} from "@/types/content";
import { StoryTexture } from "../story/story-texture";
import { HeroBody } from "./hero/hero-body";
import { HeroStatusBar } from "./hero/hero-status-bar";

export interface HeroSectionProps {
  profile: Profile;
  quickScanSpec: QuickScanSpecItem[];
  meta: SectionMeta;
  labels: UiLabels;
  routes: SiteRoutes;
}

export function HeroSection({
  profile,
  quickScanSpec,
  meta,
  labels,
  routes,
}: HeroSectionProps) {
  const resolvedProfile = useHostAwareProfile(profile);

  return (
    <section
      id={meta.anchor}
      className="relative flex scroll-mt-32 flex-col border-b border-border"
    >
      <HeroStatusBar
        status={resolvedProfile.status}
        statusLabel={labels.status}
      />
      <StoryTexture variant="grid" className="relative flex-1">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10"
        >
          <div className="h-96 w-96 rounded-full border border-primary" />
          <div className="absolute h-64 w-64 rounded-full border border-primary" />
          <div className="absolute h-32 w-32 rounded-full border border-primary" />
        </div>
        <HeroBody
          profile={resolvedProfile}
          quickScanSpec={quickScanSpec}
          meta={meta}
          labels={labels.hero}
          routes={routes}
        />
      </StoryTexture>
    </section>
  );
}
