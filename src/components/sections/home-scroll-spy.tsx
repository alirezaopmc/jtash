"use client";

import { useSectionScrollSpy } from "@/lib/use-section-scroll-spy";

export interface HomeScrollSpyProps {
  sectionAnchors: string[];
}

export function HomeScrollSpy({ sectionAnchors }: HomeScrollSpyProps) {
  useSectionScrollSpy(sectionAnchors);
  return null;
}
