"use client";

import { ThemeProvider } from "@manovaspace/ui";

import {
  SiteHeader,
  type SiteHeaderProps,
} from "@/components/layout/site-header";
import { SystemThemeSync } from "@/components/layout/system-theme-sync";
import { ThemeColorSync } from "@/components/layout/theme-color-sync";
import { useHostAwareProfile } from "@/lib/use-host-aware-profile";

export function SiteHeaderChrome({ profile, ...props }: SiteHeaderProps) {
  const resolvedProfile = useHostAwareProfile(profile);

  return (
    <ThemeProvider defaultTheme="dark" enableSystem>
      <SystemThemeSync />
      <ThemeColorSync />
      <SiteHeader profile={resolvedProfile} {...props} />
    </ThemeProvider>
  );
}
