"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  resolveDisplayInitials,
  resolveDisplayName,
} from "@/content/services/display-name";

import type { Profile } from "@/types/content";

function subscribe() {
  return () => {};
}

function getClientHostname() {
  return window.location.hostname;
}

function getServerHostname() {
  return "";
}

export function useHostAwareProfile(profile: Profile): Profile {
  const hostname = useSyncExternalStore(
    subscribe,
    getClientHostname,
    getServerHostname,
  );

  return useMemo(() => {
    if (!hostname) {
      return profile;
    }

    const name = resolveDisplayName(hostname);
    const initials = resolveDisplayInitials(hostname);

    return {
      ...profile,
      name,
      initials,
      avatarAlt: `Portrait of ${name}`,
    };
  }, [profile, hostname]);
}
