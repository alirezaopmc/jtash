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

export interface AppSiteShellProps {
  children: ReactNode;
  profile: Profile;
  navigation: NavigationConfig;
  headerTips: HeaderTips;
  footer: FooterConfig;
  routes: SiteRoutes;
  labels: UiLabels;
}

function AppSiteShellInner({
  children,
  profile,
  navigation,
  headerTips,
  footer,
  routes,
  labels,
}: AppSiteShellProps) {
  const pathname = usePathname();

  return (
    <SiteShell
      profile={profile}
      navigation={navigation}
      headerTips={headerTips}
      footer={footer}
      routes={routes}
      labels={labels}
      currentPath={pathname}
    >
      <WhatsNewAnnouncement />
      {children}
    </SiteShell>
  );
}

export function AppSiteShell(props: AppSiteShellProps) {
  return (
    <Suspense
      fallback={
        <SiteShell {...props} currentPath="/">
          {props.children}
        </SiteShell>
      }
    >
      <AppSiteShellInner {...props} />
    </Suspense>
  );
}
