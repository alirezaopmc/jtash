"use client";

import { ArrowRightIcon, Button } from "@manovaspace/ui";
import { heroSpring, SlideUp } from "@manovaspace/ui/motion";
import type {
  Profile,
  QuickScanSpecItem,
  SectionMeta,
  SiteRoutes,
  UiLabels,
} from "@/types/content";

export interface HeroBodyProps {
  profile: Profile;
  quickScanSpec: QuickScanSpecItem[];
  meta: SectionMeta;
  labels: UiLabels["hero"];
  routes: SiteRoutes;
}

function QuickScanSpecGrid({ items }: { items: QuickScanSpecItem[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-md border border-border/80 bg-muted/40 px-3 py-2"
        >
          <dt className="mono-label text-[10px] text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function QuickScanSpecList({ items }: { items: QuickScanSpecItem[] }) {
  return (
    <dl className="space-y-0">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between border-b border-border py-3.5"
        >
          <dt className="mono-label text-muted-foreground">{item.label}</dt>
          <dd className="font-mono text-sm font-medium text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function HeroBody({
  profile,
  quickScanSpec,
  meta,
  labels,
  routes,
}: HeroBodyProps) {
  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-6 px-6 py-12 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-3 lg:gap-12 lg:px-12 lg:py-28">
      <SlideUp
        className="lg:col-span-2"
        transition={{ ...heroSpring, delay: 0.05 }}
      >
        <div className="mono-label mb-4 text-primary lg:mb-6">
          {meta.introLabel}
        </div>

        <div className="mb-6 flex items-center gap-4 lg:hidden">
          <div className="size-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
            <img
              src={profile.avatar}
              alt={profile.avatarAlt}
              width={64}
              height={64}
              className="size-full object-cover object-[center_15%]"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {profile.name}
            </h1>
            <p className="mt-0.5 text-base text-muted-foreground">
              {profile.role}
            </p>
          </div>
        </div>

        <h1 className="hidden text-balance font-display text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl lg:block lg:text-7xl">
          {profile.name}
          <span className="mt-3 block text-3xl font-normal text-muted-foreground md:text-4xl lg:text-5xl">
            {profile.role}
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground lg:mt-8 lg:text-lg">
          {profile.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-4 lg:mt-10">
          <Button asChild>
            <a href={routes.projects} className="group">
              {labels.viewProjects}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={routes.blog} className="group">
              {labels.readBlog}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </Button>
        </div>

        <div className="mt-8 lg:hidden">
          <QuickScanSpecGrid items={quickScanSpec} />
        </div>
      </SlideUp>

      <SlideUp
        className="hidden lg:col-span-1 lg:block lg:border-l lg:border-border lg:pl-8"
        transition={{ ...heroSpring, delay: 0.15 }}
      >
        <div className="mb-8 overflow-hidden border border-border bg-muted">
          <img
            src={profile.avatar}
            alt={profile.avatarAlt}
            width={480}
            height={640}
            className="aspect-[3/4] w-full object-cover object-[center_15%]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <QuickScanSpecList items={quickScanSpec} />
      </SlideUp>
    </div>
  );
}
