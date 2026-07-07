"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@orbit/ui";
import { useEffect, useState } from "react";

/** Matches @orbit/ui WhatsNewManifest — use `WhatsNew` from @orbit/ui after the next publish. */
interface ReleaseItem {
  title: string;
  body: string;
  docUrl?: string;
}

interface ReleaseManifest {
  version: string;
  publishedAt: string;
  items: ReleaseItem[];
}

const STORAGE_PREFIX = "whats-new-seen";

/**
 * Reference wiring for `public/releases.json`. Replace with `<WhatsNew manifestUrl="..." />`
 * from `@orbit/ui` once the package version including WhatsNew is on the registry.
 */
export function WhatsNewAnnouncement() {
  const [manifest, setManifest] = useState<ReleaseManifest | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/releases.json");
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as ReleaseManifest;
        if (cancelled || !data.version || !Array.isArray(data.items) || data.items.length === 0) {
          return;
        }
        if (localStorage.getItem(`${STORAGE_PREFIX}-${data.version}`)) {
          return;
        }
        setManifest(data);
        setOpen(true);
      } catch {
        // optional UX — missing manifest must not break the app
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  function dismiss() {
    if (manifest) {
      localStorage.setItem(`${STORAGE_PREFIX}-${manifest.version}`, "1");
    }
    setOpen(false);
  }

  if (!manifest) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          dismiss();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogContent aria-describedby="whats-new-description">
        <DialogHeader>
          <DialogTitle>What&apos;s new</DialogTitle>
          <DialogDescription id="whats-new-description">
            {manifest.publishedAt ? `Updated ${manifest.publishedAt}` : undefined}
          </DialogDescription>
        </DialogHeader>
        <ul className="max-h-[min(50vh,20rem)] space-y-4 overflow-y-auto px-4 pb-2">
          {manifest.items.map((item) => (
            <li key={item.title} className="space-y-1 text-sm">
              <p className="font-medium text-[var(--foreground)]">
                {item.docUrl ? (
                  <a href={item.docUrl} className="underline-offset-4 hover:underline">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </p>
              <p className="text-[var(--muted-foreground)]">{item.body}</p>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button type="button" onClick={dismiss}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
