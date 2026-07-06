import { cn } from "@orbit/ui";
import type { SkillProficiency } from "@/types/content";

export const skillProficiencyStyles: Record<SkillProficiency, string> = {
  core: cn(
    "border-primary/70 bg-primary/10 text-foreground",
    "shadow-[0_0_0_1px_hsl(var(--primary)/0.12),0_0_24px_hsl(var(--primary)/0.12)]",
  ),
  experienced: "border-primary/35 bg-card/90 text-foreground",
  familiar:
    "border-dashed border-muted-foreground/35 bg-muted/40 text-muted-foreground",
};

export function getSkillNodeClassName(
  proficiency: SkillProficiency = "experienced",
  interactive = true,
) {
  return cn(
    "relative inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5",
    "font-mono text-xs transition-all duration-300",
    skillProficiencyStyles[proficiency],
    interactive &&
      "hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.25),0_8px_24px_hsl(var(--primary)/0.15)]",
  );
}
