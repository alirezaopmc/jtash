import Link from "next/link";

import { notFound } from "@/content/shell";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100svh-var(--statusline-h))] flex-col items-start justify-center px-6 sm:px-10">
      <h1 className="font-medium font-mono text-2xl text-foreground tracking-tight sm:text-3xl">
        {notFound.message}
      </h1>
      <Link
        className="mt-6 inline-flex min-h-11 items-center font-mono text-muted-foreground text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        href={notFound.homeHref}
      >
        {notFound.homeLabel}
      </Link>
    </main>
  );
}
