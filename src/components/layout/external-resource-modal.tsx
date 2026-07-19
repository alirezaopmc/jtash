"use client";

import {
  Button,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@manovaspace/ui";
import { XMarkIcon } from "@manovaspace/ui";
import { useState } from "react";
import { isMailtoHref } from "@/lib/external-link";
import type {
  ExternalLinkLabels,
  ExternalLinkProfile,
} from "@/types/external-link";
import { StoryInstitutionLogo } from "../story/story-institution-logo";

export interface ExternalResourceModalProps {
  profile: ExternalLinkProfile | null;
  labels: ExternalLinkLabels;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExternalResourceModal({
  profile,
  labels,
  open,
  onOpenChange,
}: ExternalResourceModalProps) {
  const [copied, setCopied] = useState(false);

  if (!profile) {
    return null;
  }

  const isMailto = isMailtoHref(profile.url);
  const mailAddress = isMailto
    ? profile.url.replace(/^mailto:/i, "").split("?")[0]
    : null;

  const handleCopyEmail = async () => {
    if (!mailAddress) {
      return;
    }

    try {
      await navigator.clipboard.writeText(mailAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setCopied(false);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent
        className={cn(
          "flex w-[calc(100vw-1rem)] max-w-none flex-col",
          "max-h-[min(96dvh,52rem)] overflow-hidden",
          "sm:w-full sm:max-w-2xl",
          "md:max-w-3xl",
          "lg:max-w-4xl",
        )}
        style={{
          borderLeftWidth: 3,
          borderLeftColor: profile.accentColor ?? "hsl(var(--primary))",
        }}
      >
        <DialogClose
          className={cn(
            "absolute top-4 right-4 flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <XMarkIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <DialogHeader>
          <div className="flex items-start gap-4">
            {profile.logo ? (
              <StoryInstitutionLogo
                src={profile.logo}
                alt={profile.logoAlt ?? profile.title}
                className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl sm:text-2xl">
                {profile.title}
              </DialogTitle>
              {profile.subtitle ? (
                <DialogDescription className="mt-1">
                  {profile.subtitle}
                </DialogDescription>
              ) : null}
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {profile.meta && profile.meta.length > 0 ? (
            <dl className="mb-5 grid gap-3 sm:grid-cols-3">
              {profile.meta.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-border/80 bg-muted/40 px-3 py-2"
                >
                  <dt className="mono-label text-[10px] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {profile.description ? (
            <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
              {profile.description}
            </p>
          ) : null}

          {profile.facts && profile.facts.length > 0 ? (
            <ul className="mt-5 space-y-2 border-t border-border/80 pt-5">
              {profile.facts.map((fact) => (
                <li
                  key={fact}
                  className={cn(
                    'flex gap-2 text-sm text-muted-foreground before:mt-2 before:size-1.5 before:shrink-0 before:rounded-full before:bg-primary before:content-[""]',
                  )}
                >
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          {isMailto ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleCopyEmail()}
              >
                {copied ? "Copied" : labels.copyEmail}
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <a href={profile.url}>{labels.openInMail}</a>
              </Button>
            </>
          ) : (
            <Button asChild className="w-full sm:w-auto">
              <a href={profile.url} target="_blank" rel="noopener noreferrer">
                {labels.visit}
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
