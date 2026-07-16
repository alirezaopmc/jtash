"use client";

import { Badge, cn } from "@manovaspace/ui";
import type { ReactNode } from "react";
import { minimalLinkProfile } from "@/lib/external-link";
import type { StackItem } from "@/types/content";
import { ExternalLinkTrigger } from "./layout/external-link-trigger";

export interface StackTagProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function StackTag({ children, className, href }: StackTagProps) {
  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md font-mono text-xs text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary",
        href && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Badge>
  );

  if (href) {
    const title = typeof children === "string" ? children : String(children);

    return (
      <ExternalLinkTrigger profile={minimalLinkProfile(title, href)}>
        {badge}
      </ExternalLinkTrigger>
    );
  }

  return badge;
}

export interface StackTagListProps {
  items: StackItem[] | string[];
  className?: string;
}

export function StackTagList({ items, className }: StackTagListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => {
        const { label, url } =
          typeof item === "string" ? { label: item, url: undefined } : item;

        return (
          <StackTag key={label} href={url}>
            {label}
          </StackTag>
        );
      })}
    </div>
  );
}
