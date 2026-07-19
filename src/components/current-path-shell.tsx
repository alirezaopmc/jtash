"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import { WhatsNewAnnouncement } from "@/components/whats-new-announcement";
import type {
  FooterConfig,
  HeaderTips,
  NavigationConfig,
  Profile,
  SiteRoutes,
  UiLabels,
} from "@/types/content";

export interface CurrentPathShellProps {
  children: ReactNode;
  profile: Profile;
  navigation: NavigationConfig;
  headerTips: HeaderTips;
  footer: FooterConfig;
  routes: SiteRoutes;
  labels: UiLabels;
}

function CurrentPathShellInner(props: CurrentPathShellProps) {
  const pathname = usePathname();
  return (
    <SiteShell {...props} currentPath={pathname}>
      <WhatsNewAnnouncement />
      {props.children}
    </SiteShell>
  );
}

export function CurrentPathShell(props: CurrentPathShellProps) {
  return (
    <Suspense
      fallback={
        <SiteShell {...props} currentPath="/">
          {props.children}
        </SiteShell>
      }
    >
      <CurrentPathShellInner {...props} />
    </Suspense>
  );
}
