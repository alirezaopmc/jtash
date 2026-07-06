"use client";

import { SectionHeader } from "@/components/layout/section-header";
import type { SectionMeta, SkillNode } from "@/types/content";
import { StorySection } from "../story/story-section";
import { SkillTree } from "./skills/skill-tree";

export interface SkillsSectionProps {
  tree: SkillNode;
  meta: SectionMeta;
}

export function SkillsSection({ tree, meta }: SkillsSectionProps) {
  return (
    <StorySection id={meta.anchor} band="dark" className="story-texture-pcb">
      <SectionHeader number={meta.number} title={meta.title} meta={meta.meta} />
      <SkillTree root={tree} />
    </StorySection>
  );
}
