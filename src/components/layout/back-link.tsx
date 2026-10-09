import { ArrowLeftIcon, Button, cn } from "@manovaspace/ui";
import type { ReactNode } from "react";

export interface BackLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Button
      asChild
      variant="link"
      className={cn("h-auto p-0 text-primary", className)}
    >
      <a href={href} className="inline-flex items-center gap-2">
        <ArrowLeftIcon className="h-4 w-4" />
        {children}
      </a>
    </Button>
  );
}
