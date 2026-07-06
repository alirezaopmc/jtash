import {
  resolveDisplayInitials,
  resolveDisplayLocation,
  resolveDisplayMetaDescription,
  resolveDisplayName,
} from "@/content/services/display-name";
import { shuffleItems } from "@/content/services/shuffle";
import type {
  HeaderTips,
  Profile,
  QuickScanSpecItem,
  SiteConfig,
  SiteContent,
} from "@/types/content";

function resolveHeaderTips(headerTips: HeaderTips): HeaderTips {
  if (headerTips.items.length <= 1) {
    return headerTips;
  }

  return {
    ...headerTips,
    items: shuffleItems(headerTips.items),
  };
}

function resolveQuickScanSpecForHost(
  quickScanSpec: QuickScanSpecItem[],
  hostname?: string,
): QuickScanSpecItem[] {
  const location = resolveDisplayLocation(hostname);

  return quickScanSpec.map((item) =>
    item.label === "LOCATION" ? { ...item, value: location } : item,
  );
}

function resolveProfileForHost(profile: Profile, hostname?: string): Profile {
  const name = resolveDisplayName(hostname);
  const initials = resolveDisplayInitials(hostname);

  return {
    ...profile,
    name,
    initials,
    avatarAlt: `Portrait of ${name}`,
  };
}

function resolveSiteConfigForHost(
  site: SiteConfig,
  hostname?: string,
): SiteConfig {
  const name = resolveDisplayName(hostname);

  return {
    ...site,
    meta: {
      ...site.meta,
      title: name,
      description: resolveDisplayMetaDescription(hostname),
    },
  };
}

export function resolveSiteContentForHost(
  content: SiteContent,
  hostname?: string,
): SiteContent {
  return {
    ...content,
    profile: resolveProfileForHost(content.profile, hostname),
    site: resolveSiteConfigForHost(content.site, hostname),
    quickScanSpec: resolveQuickScanSpecForHost(content.quickScanSpec, hostname),
    headerTips: resolveHeaderTips(content.headerTips),
  };
}
