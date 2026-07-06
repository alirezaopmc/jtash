"use client";

import { useEffect } from "react";

const SCROLL_SPY_OFFSET_PX = 96;

function getActiveSectionId(sectionIds: string[]): string | null {
  let active = sectionIds[0] ?? null;

  for (const id of sectionIds) {
    const element = document.getElementById(id);
    if (!element) continue;

    if (element.getBoundingClientRect().top <= SCROLL_SPY_OFFSET_PX) {
      active = id;
    }
  }

  return active;
}

function updateLocationHash(sectionIds: string[]) {
  const activeId = getActiveSectionId(sectionIds);
  if (!activeId) return;

  const nextHash = `#${activeId}`;
  if (
    `${window.location.pathname}${window.location.hash}` ===
    `${window.location.pathname}${nextHash}`
  ) {
    return;
  }

  window.history.replaceState(null, "", nextHash);
}

export function useSectionScrollSpy(sectionIds: string[]) {
  const sectionKey = sectionIds.join("|");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    let frame = 0;

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updateLocationHash(sectionIds);
      });
    };

    const initialTimeout = window.setTimeout(scheduleUpdate, 0);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.clearTimeout(initialTimeout);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [sectionKey]);
}
