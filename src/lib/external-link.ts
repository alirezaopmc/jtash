import type { CompanyProfile, Experience } from "@/types/content";

import type { ExternalLinkProfile } from "@/types/external-link";

export const EXTERNAL_LINK_OPEN_EVENT = "jtash:open-external-link";

export function dispatchOpenExternalLink(profile: ExternalLinkProfile) {
  if (typeof document === "undefined") {
    return;
  }

  document.dispatchEvent(
    new CustomEvent<ExternalLinkProfile>(EXTERNAL_LINK_OPEN_EVENT, {
      detail: profile,
    }),
  );
}

export function subscribeOpenExternalLink(
  handler: (profile: ExternalLinkProfile) => void,
) {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  const listener = (event: Event) => {
    handler((event as CustomEvent<ExternalLinkProfile>).detail);
  };

  document.addEventListener(EXTERNAL_LINK_OPEN_EVENT, listener);
  return () => document.removeEventListener(EXTERNAL_LINK_OPEN_EVENT, listener);
}

export function openExternalLinkProfile(
  profile: ExternalLinkProfile,
  contextOpen?: (profile: ExternalLinkProfile) => void,
) {
  if (contextOpen) {
    contextOpen(profile);
    return;
  }

  dispatchOpenExternalLink(profile);
}

export function isExternalHref(href: string): boolean {
  return (
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:")
  );
}

export function hrefToHost(href: string): string {
  if (href.startsWith("mailto:")) {
    return href.replace(/^mailto:/i, "").split("?")[0] ?? href;
  }

  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function isMailtoHref(href: string): boolean {
  return href.toLowerCase().startsWith("mailto:");
}

export function companyProfileToLinkProfile(
  profile: CompanyProfile,
  options: {
    title: string;
    logo?: string;
    logoAlt?: string;
    accentColor?: string;
    subtitle?: string;
  },
): ExternalLinkProfile {
  const meta = [
    profile.industry ? { label: "Industry", value: profile.industry } : null,
    profile.founded ? { label: "Founded", value: profile.founded } : null,
    profile.headquarters
      ? { label: "Headquarters", value: profile.headquarters }
      : null,
  ].filter((item): item is { label: string; value: string } => item != null);

  return {
    title: options.title,
    url: profile.website,
    description: profile.description,
    subtitle: options.subtitle ?? profile.headquarters,
    facts: profile.facts,
    meta: meta.length > 0 ? meta : undefined,
    logo: options.logo,
    logoAlt: options.logoAlt,
    accentColor: options.accentColor,
  };
}

export function experienceToLinkProfile(
  experience: Experience,
): ExternalLinkProfile | null {
  const url = experience.link ?? experience.companyProfile?.website;
  if (!url) {
    return null;
  }

  if (experience.companyProfile) {
    return companyProfileToLinkProfile(experience.companyProfile, {
      title: experience.company,
      logo: experience.logo,
      logoAlt: experience.company,
      accentColor: experience.accentColor,
      subtitle: experience.location,
    });
  }

  return {
    title: experience.company,
    url,
    description: experience.summary,
    subtitle: experience.location,
    logo: experience.logo,
    logoAlt: experience.company,
    accentColor: experience.accentColor,
    meta: [{ label: "Host", value: hrefToHost(url) }],
  };
}

export function minimalLinkProfile(
  title: string,
  url: string,
  description?: string,
): ExternalLinkProfile {
  return {
    title,
    url,
    description: description ?? hrefToHost(url),
    meta: isMailtoHref(url)
      ? undefined
      : [{ label: "Host", value: hrefToHost(url) }],
  };
}
