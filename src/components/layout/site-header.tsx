"use client";

import { Badge, Button } from "@manovaspace/ui";
import { isExternalHref, minimalLinkProfile } from "@/lib/external-link";
import type {
  HeaderTips,
  NavigationConfig,
  Profile,
  SiteRoutes,
  UiLabels,
} from "@/types/content";
import { ExternalLinkTrigger } from "./external-link-trigger";
import { ThemeToggle } from "./theme-toggle";

export interface SiteHeaderProps {
  profile: Profile;
  navigation: NavigationConfig;
  headerTips: HeaderTips;
  routes: SiteRoutes;
  labels: UiLabels["headerTips"];
  themeLabels: UiLabels["theme"];
  currentPath?: string;
}

export function SiteHeader({
  profile,
  navigation,
  routes,
  themeLabels,
  currentPath = "/",
}: SiteHeaderProps) {
  const contactHref = navigation.contact.href;
  const contactIsExternal = isExternalHref(contactHref);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <nav className="flex h-16 items-center justify-between gap-4">
          <a
            href={routes.home}
            className="group flex shrink-0 items-center gap-3"
          >
            <Badge
              variant="outline"
              className="rounded-md px-2 py-1 font-mono text-sm font-bold text-foreground transition-colors duration-200 group-hover:border-primary group-hover:text-primary"
            >
              {profile.initials}
            </Badge>
            <span className="hidden text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary sm:block">
              {profile.name}
            </span>
          </a>

          <div className="flex shrink-0 items-center gap-6 md:gap-8">
            {navigation.header.map((link) => {
              const isActive = currentPath.startsWith(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <ThemeToggle labels={themeLabels} />
            {contactIsExternal ? (
              <ExternalLinkTrigger
                profile={minimalLinkProfile(
                  navigation.contact.label,
                  contactHref,
                  profile.email,
                )}
                className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                {navigation.contact.label}
              </ExternalLinkTrigger>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="h-auto px-0 text-muted-foreground hover:text-primary"
              >
                <a href={contactHref}>{navigation.contact.label}</a>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
