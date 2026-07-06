"use client";

import { cn } from "@orbit/ui";
import type { Experience, UiLabels } from "@/types/content";
import { StackTagList } from "../../stack-tag";
import { parseExperienceHighlight } from "../shared/experience-utils";

export interface ExperienceDetailPanelProps {
  item: Experience;
  labels: UiLabels["experience"];
}

export function ExperienceDetailPanel({
  item,
  labels,
}: ExperienceDetailPanelProps) {
  return (
    <div className="border-t border-border bg-muted/80 px-6 py-6">
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        {item.summary}
      </p>
      <p className="mono-label mb-4 font-medium text-muted-foreground">
        {labels.highlights}
      </p>
      <ul className="space-y-3.5">
        {item.highlights.map((highlight) => {
          const parsed = parseExperienceHighlight(highlight);

          return (
            <li
              key={highlight}
              className="flex gap-3 text-sm leading-relaxed text-foreground"
            >
              <span
                aria-hidden
                className="mt-2 h-2 w-2 flex-shrink-0 rounded-sm bg-primary"
              />
              <span>
                {parsed.title ? (
                  <>
                    <span className="font-semibold text-foreground">
                      {parsed.title}:
                    </span>{" "}
                    {parsed.body}
                  </>
                ) : (
                  parsed.body
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div
        className={cn(
          "mt-6 grid grid-cols-1 gap-6 border-t border-border pt-5",
          item.technologies.length > 0 && "md:grid-cols-2",
        )}
      >
        <div>
          <p className="mono-label mb-4 text-muted-foreground">
            {labels.stack}
          </p>
          <StackTagList items={item.stack} />
        </div>
        {item.technologies.length > 0 ? (
          <div>
            <p className="mono-label mb-4 text-muted-foreground">
              {labels.technologies}
            </p>
            <StackTagList items={item.technologies} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
