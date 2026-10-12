"use client";

import { cn } from "@manovaspace/ui";
import { RevealOnScroll, useReducedMotion } from "@manovaspace/ui/motion";
import { useEffect, useRef, useState } from "react";
import type { SkillNode } from "@/types/content";
import { SkillTreeNode } from "./skill-tree-node";

export interface SkillTreeProps {
  root: SkillNode;
  className?: string;
}

function SkillTreeBranch({ node, index }: { node: SkillNode; index: number }) {
  return (
    <RevealOnScroll
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.45 }}
      className="relative flex flex-col items-center"
    >
      <div
        aria-hidden
        className="mb-4 h-8 w-px bg-gradient-to-b from-primary/50 to-primary/10"
      />
      <h3 className="mono-label mb-5 text-center font-medium text-primary">
        {node.label.toUpperCase()}
      </h3>
      <div className="flex flex-wrap justify-center gap-2.5">
        {node.children?.map((child, childIndex) => (
          <RevealOnScroll
            key={child.id}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 + index * 0.08 + childIndex * 0.04 }}
          >
            <SkillTreeNode node={child} />
          </RevealOnScroll>
        ))}
      </div>
    </RevealOnScroll>
  );
}

function SkillTreeFocus({ focus }: { focus: string }) {
  return (
    <RevealOnScroll
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55 }}
      className="relative mb-12 flex flex-col items-center text-center"
    >
      <p className="mono-label mb-3 text-[10px] tracking-[0.25em] text-muted-foreground">
        FOCUS
      </p>
      <h3 className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {focus}
      </h3>
      <div
        aria-hidden
        className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
    </RevealOnScroll>
  );
}

function SkillTreeExpertise({ node }: { node: SkillNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <RevealOnScroll
      initial={{ opacity: 0, y: -16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="relative mb-10 flex flex-col items-center"
    >
      <div className="flex flex-wrap justify-center gap-3">
        {node.children?.map((child, index) => (
          <RevealOnScroll
            key={child.id}
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <SkillTreeNode node={child} size="lg" />
          </RevealOnScroll>
        ))}
      </div>
      <p className="mono-label mt-4 text-[10px] tracking-[0.2em] text-muted-foreground">
        {node.label.toUpperCase()}
      </p>
      <div
        aria-hidden
        className="mt-4 h-10 w-px bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"
      />
      <div
        aria-hidden
        className={cn(
          "relative flex h-4 w-4 rotate-45 items-center justify-center border border-primary/60 bg-primary/20",
          !reducedMotion && "skill-tree-pulse",
        )}
      >
        <span className="absolute inset-1 bg-primary/70" />
      </div>
    </RevealOnScroll>
  );
}

function SkillTreeHub({ label }: { label: string }) {
  return (
    <RevealOnScroll
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative mx-auto mb-8 flex flex-col items-center"
    >
      <div
        aria-hidden
        className="absolute -inset-6 rounded-full bg-primary/5 blur-2xl"
      />
      <div className="relative rounded-full border border-primary/30 bg-card/80 px-5 py-2 shadow-[0_0_32px_hsl(var(--primary)/0.12)] backdrop-blur-sm">
        <span className="mono-label text-sm font-medium text-primary">
          {label.toUpperCase()}
        </span>
      </div>
      <div
        aria-hidden
        className="mt-4 h-8 w-px bg-gradient-to-b from-primary/40 to-transparent"
      />
    </RevealOnScroll>
  );
}

function SkillTreeConnectors({ branchCount }: { branchCount: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [isInView, setIsInView] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setIsInView(true);
      return;
    }

    const path = pathRef.current;
    if (!path) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    observer.observe(path);
    return () => observer.disconnect();
  }, [reducedMotion]);

  if (branchCount < 2) {
    return null;
  }

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[13.5rem] hidden h-16 w-[min(100%,42rem)] -translate-x-1/2 md:block"
      viewBox="0 0 672 64"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d="M336 0 V20 M336 20 C336 20 112 20 112 52 M336 20 C336 20 336 52 336 52 M336 20 C336 20 560 20 560 52"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: isInView ? 0 : 1,
          transition: reducedMotion
            ? "none"
            : "stroke-dashoffset 1s ease-in-out 300ms",
        }}
      />
    </svg>
  );
}

export function SkillTree({ root, className }: SkillTreeProps) {
  const expertise = root.children?.find((child) => child.id === "expertise");
  const branches =
    root.children?.filter((child) => child.id !== "expertise") ?? [];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/80 bg-card/40 p-6 md:p-10",
        "shadow-[inset_0_1px_0_hsl(var(--primary)/0.08)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        {root.focus ? <SkillTreeFocus focus={root.focus} /> : null}
        {expertise ? <SkillTreeExpertise node={expertise} /> : null}
        <SkillTreeHub label={root.label} />
        <SkillTreeConnectors branchCount={branches.length} />

        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          {branches.map((branch, index) => (
            <SkillTreeBranch key={branch.id} node={branch} index={index} />
          ))}
        </div>

        <p className="mono-label mt-10 text-center text-[10px] text-muted-foreground/80">
          Hover grouped nodes to reveal tools · Tap on mobile
        </p>
      </div>
    </div>
  );
}
