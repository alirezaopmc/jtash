"use client";

import {
  SiteHeader,
  type SiteHeaderProps,
} from "@/components/layout/site-header";
import { ThemeColorSync } from "@/components/layout/theme-color-sync";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { useHostAwareProfile } from "@/lib/use-host-aware-profile";

export function SiteHeaderChrome({ profile, ...props }: SiteHeaderProps) {
  const resolvedProfile = useHostAwareProfile(profile);

  return (
    <ThemeProvider>
      <ThemeColorSync />
      <SiteHeader profile={resolvedProfile} {...props} />
    </ThemeProvider>
  );
}
