import type { ReactNode } from "react";

import { CurrentPathShell } from "@/components/current-path-shell";
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

/** Server-friendly shell: only the pathname-aware wrapper is a client boundary. */
export function AppSiteShell(props: AppSiteShellProps) {
  return <CurrentPathShell {...props} />;
}
