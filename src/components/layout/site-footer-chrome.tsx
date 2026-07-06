"use client";

import {
  SiteFooter,
  type SiteFooterProps,
} from "@/components/layout/site-footer";
import { useHostAwareProfile } from "@/lib/use-host-aware-profile";

export function SiteFooterChrome({ profile, ...props }: SiteFooterProps) {
  const resolvedProfile = useHostAwareProfile(profile);

  return <SiteFooter profile={resolvedProfile} {...props} />;
}
