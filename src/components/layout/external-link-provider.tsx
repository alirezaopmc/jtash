"use client";

import {
  createContext,
  lazy,
  type ReactNode,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  dispatchOpenExternalLink,
  subscribeOpenExternalLink,
} from "@/lib/external-link";
import type {
  ExternalLinkLabels,
  ExternalLinkProfile,
} from "@/types/external-link";

const ExternalResourceModal = lazy(() =>
  import("./external-resource-modal").then((module) => ({
    default: module.ExternalResourceModal,
  })),
);

interface ExternalLinkContextValue {
  openExternalLink: (profile: ExternalLinkProfile) => void;
  labels: ExternalLinkLabels;
}

const ExternalLinkContext = createContext<ExternalLinkContextValue | null>(
  null,
);

export interface ExternalLinkProviderProps {
  children: ReactNode;
  labels: ExternalLinkLabels;
}

export function ExternalLinkProvider({
  children,
  labels,
}: ExternalLinkProviderProps) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ExternalLinkProfile | null>(null);

  const openExternalLink = useCallback((nextProfile: ExternalLinkProfile) => {
    setProfile(nextProfile);
    setOpen(true);
  }, []);

  useEffect(() => {
    return subscribeOpenExternalLink(openExternalLink);
  }, [openExternalLink]);

  const value = useMemo(
    () => ({ openExternalLink, labels }),
    [labels, openExternalLink],
  );

  return (
    <ExternalLinkContext.Provider value={value}>
      {children}
      {open && profile ? (
        <Suspense fallback={null}>
          <ExternalResourceModal
            profile={profile}
            labels={labels}
            open={open}
            onOpenChange={setOpen}
          />
        </Suspense>
      ) : null}
    </ExternalLinkContext.Provider>
  );
}

export function useExternalLink() {
  return useContext(ExternalLinkContext);
}

export function useOpenExternalLink() {
  const context = useExternalLink();

  return useCallback(
    (profile: ExternalLinkProfile) => {
      if (context) {
        context.openExternalLink(profile);
        return;
      }

      dispatchOpenExternalLink(profile);
    },
    [context],
  );
}
