"use client";

import { Mail } from "lucide-react";
import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiTelegram } from "react-icons/si";

import { minimalLinkProfile } from "@/lib/external-link";
import type { FooterConfig, Profile } from "@/types/content";
import type { ExternalLinkLabels } from "@/types/external-link";
import { ExternalLinkTrigger } from "./external-link-trigger";

export const SITE_FOOTER_ID = "site-footer";

export interface SiteFooterProps {
  profile: Profile;
  footer: FooterConfig;
  labels: {
    github: string;
    linkedin: string;
    telegram: string;
    email: string;
  };
  externalLinkLabels: ExternalLinkLabels;
}

type SocialLinkIcon = IconType | typeof Mail;

export function SiteFooter({
  profile,
  footer,
  labels,
  externalLinkLabels,
}: SiteFooterProps) {
  const socialLinks: {
    profile: ReturnType<typeof minimalLinkProfile>;
    icon: SocialLinkIcon;
    label: string;
  }[] = [
    {
      profile: minimalLinkProfile(
        labels.github,
        profile.github,
        externalLinkLabels.githubDescription,
      ),
      icon: SiGithub,
      label: labels.github,
    },
    {
      profile: minimalLinkProfile(
        labels.linkedin,
        profile.linkedin,
        externalLinkLabels.linkedinDescription,
      ),
      icon: FaLinkedinIn,
      label: labels.linkedin,
    },
    {
      profile: minimalLinkProfile(
        labels.telegram,
        profile.telegram,
        externalLinkLabels.telegramDescription,
      ),
      icon: SiTelegram,
      label: labels.telegram,
    },
    {
      profile: minimalLinkProfile(
        labels.email,
        `mailto:${profile.email}`,
        profile.email,
      ),
      icon: Mail,
      label: labels.email,
    },
  ];

  return (
    <footer
      id={SITE_FOOTER_ID}
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="inline-block border border-border px-2 py-1 font-mono text-sm font-bold text-foreground">
              {profile.initials}
            </span>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {profile.tagline}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ profile: linkProfile, icon: Icon, label }) => (
              <ExternalLinkTrigger
                key={label}
                profile={linkProfile}
                className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="sr-only">{label}</span>
              </ExternalLinkTrigger>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <span className="mono-label text-muted-foreground">
            © {new Date().getFullYear()} {profile.name.toUpperCase()}
          </span>
          <span className="mono-label text-muted-foreground">
            {footer.tagline} · {footer.revision}
          </span>
        </div>
      </div>
    </footer>
  );
}
