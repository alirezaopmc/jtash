"use client";

import { ChevronDownIcon, cn, ExternalLinkIcon } from "@manovaspace/ui";
import { useState } from "react";

import { minimalLinkProfile } from "@/lib/external-link";
import { getSkillNodeClassName } from "@/lib/skill-tree-styles";
import type { SkillNode } from "@/types/content";
import { ExternalLinkTrigger } from "../../layout/external-link-trigger";

export interface SkillTreeNodeProps {
  node: SkillNode;
  className?: string;
  size?: "default" | "lg";
}

function SkillNodeContent({
  node,
  showChevron = false,
  expanded = false,
}: {
  node: SkillNode;
  showChevron?: boolean;
  expanded?: boolean;
}) {
  return (
    <>
      <span>{node.label}</span>
      {node.url ? (
        <ExternalLinkIcon
          className="h-3 w-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      ) : null}
      {showChevron ? (
        <ChevronDownIcon
          className={cn(
            "h-3 w-3 shrink-0 opacity-50 transition-transform duration-300",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
      ) : null}
    </>
  );
}

function SkillNodeShell({
  node,
  className,
  showChevron = false,
  expanded = false,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onClick,
}: {
  node: SkillNode;
  className?: string;
  showChevron?: boolean;
  expanded?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
}) {
  const classNames = cn(
    "group",
    getSkillNodeClassName(node.proficiency),
    className,
  );

  if (node.url && !showChevron) {
    return (
      <ExternalLinkTrigger
        profile={minimalLinkProfile(node.label, node.url, node.description)}
        className={classNames}
      >
        <SkillNodeContent
          node={node}
          showChevron={showChevron}
          expanded={expanded}
        />
      </ExternalLinkTrigger>
    );
  }

  return (
    <span
      className={classNames}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      onKeyDown={(event) => {
        if (showChevron && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={showChevron ? 0 : undefined}
      role={showChevron ? "button" : undefined}
      aria-expanded={showChevron ? expanded : undefined}
    >
      <SkillNodeContent
        node={node}
        showChevron={showChevron}
        expanded={expanded}
      />
    </span>
  );
}

function SkillHoverPanel({
  node,
  visible,
}: {
  node: SkillNode;
  visible: boolean;
}) {
  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "absolute left-1/2 top-[calc(100%+0.75rem)] z-20 w-max max-w-[min(18rem,calc(100vw-3rem))] -translate-x-1/2 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-1.5 scale-[0.98] opacity-0",
      )}
    >
      <div
        aria-hidden
        className="absolute -top-2 left-1/2 h-2 w-px -translate-x-1/2 bg-gradient-to-b from-primary/60 to-primary/20"
      />
      <div className="rounded-lg border border-primary/25 bg-card/95 p-3 shadow-[0_12px_40px_hsl(var(--primary)/0.12)] backdrop-blur-sm">
        {node.description ? (
          <p className="mono-label mb-2 text-[10px] text-muted-foreground">
            {node.description}
          </p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-2">
          {node.children?.map((child, index) => (
            <div
              key={child.id}
              className={cn(
                "translate-y-1.5 opacity-0 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                visible && "translate-y-0 opacity-100",
              )}
              style={{ transitionDelay: visible ? `${index * 50}ms` : "0ms" }}
            >
              <SkillTreeNode node={child} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkillTreeNode({
  node,
  className,
  size = "default",
}: SkillTreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const isCollapsible = Boolean(node.collapsible && node.children?.length);
  const sizeClassName = size === "lg" ? "px-4 py-2 text-sm" : undefined;

  if (isCollapsible) {
    return (
      <div
        className={cn("relative", className)}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setExpanded(false);
          }
        }}
      >
        <SkillNodeShell
          node={node}
          showChevron
          expanded={expanded}
          className={cn(
            sizeClassName,
            expanded &&
              "border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_0_28px_hsl(var(--primary)/0.18)]",
          )}
          onClick={() => setExpanded((value) => !value)}
        />
        <SkillHoverPanel node={node} visible={expanded} />
      </div>
    );
  }

  return (
    <div className={className}>
      <SkillNodeShell node={node} className={sizeClassName} />
    </div>
  );
}
