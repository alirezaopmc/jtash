"use client";

import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import { subscribeOpenExternalLink } from "@/lib/external-link";
import type {
  ExternalLinkLabels,
  ExternalLinkProfile,
} from "@/types/external-link";

const ExternalResourceModal = lazy(() =>
  import("./external-resource-modal").then((module) => ({
    default: module.ExternalResourceModal,
  })),
);

export interface ExternalLinkHostProps {
  labels: ExternalLinkLabels;
}

export function ExternalLinkHost({ labels }: ExternalLinkHostProps) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ExternalLinkProfile | null>(null);

  const openExternalLink = useCallback((nextProfile: ExternalLinkProfile) => {
    setProfile(nextProfile);
    setOpen(true);
  }, []);

  useEffect(() => {
    return subscribeOpenExternalLink(openExternalLink);
  }, [openExternalLink]);

  if (!open || !profile) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ExternalResourceModal
        profile={profile}
        labels={labels}
        open={open}
        onOpenChange={setOpen}
      />
    </Suspense>
  );
}
