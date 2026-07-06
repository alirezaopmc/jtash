"use client";

import type { ReactNode } from "react";
import { ExternalLinkProvider } from "@/components/layout/external-link-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteTipsBar } from "@/components/layout/site-tips-bar";
import { ThemeColorSync } from "@/components/layout/theme-color-sync";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { useHostAwareProfile } from "@/lib/use-host-aware-profile";
import type {
  FooterConfig,
  HeaderTips,
  NavigationConfig,
  Profile,
  SiteRoutes,
  UiLabels,
} from "@/types/content";

export interface SiteShellProps {
  children: ReactNode;
  profile: Profile;
  navigation: NavigationConfig;
  headerTips: HeaderTips;
  footer: FooterConfig;
  routes: SiteRoutes;
  labels: UiLabels;
  currentPath?: string;
}

export function SiteShell({
  children,
  profile,
  navigation,
  headerTips,
  footer,
  routes,
  labels,
  currentPath,
}: SiteShellProps) {
  const resolvedProfile = useHostAwareProfile(profile);

  return (
    <ThemeProvider>
      <ThemeColorSync />
      <ExternalLinkProvider labels={labels.externalLink}>
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader
            profile={resolvedProfile}
            navigation={navigation}
            headerTips={headerTips}
            routes={routes}
            labels={labels.headerTips}
            themeLabels={labels.theme}
            currentPath={currentPath}
          />
          <div className="flex flex-1 flex-col">
            <main className="flex-1">{children}</main>
            <SiteTipsBar headerTips={headerTips} labels={labels.headerTips} />
          </div>
          <SiteFooter
            profile={resolvedProfile}
            footer={footer}
            labels={labels.footer}
            externalLinkLabels={labels.externalLink}
          />
        </div>
      </ExternalLinkProvider>
    </ThemeProvider>
  );
}
