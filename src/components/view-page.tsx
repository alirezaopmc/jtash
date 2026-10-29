import { Hero } from "@/components/sections/hero";
import { sections } from "@/content/sections";
import type { View } from "@/content/types";

type ViewPageProps = {
  view: View;
};

export function ViewPage({ view }: ViewPageProps) {
  const orderedSections = sections
    .filter((section) => section.order[view] !== undefined)
    .sort((a, b) => (a.order[view] ?? 0) - (b.order[view] ?? 0));

  return (
    <main>
      {orderedSections.map((section) => {
        if (section.id === "hero") {
          return <Hero key={section.id} view={view} />;
        }

        return null;
      })}
    </main>
  );
}
