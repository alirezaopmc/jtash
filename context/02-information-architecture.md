# 02 — Information architecture

## Routes

| Route | View | Purpose |
|---|---|---|
| `/` | Neutral | Default. No choice required. Hero + a balanced section order. |
| `/hire` | Hire | Profession and experience first. Shareable: send this link to a recruiter. |
| `/casual` | Casual | Who I am and what I think about first. |

- The URL is the source of truth for the view. No client-only mode state, no redirect based on
  stored preference. Switching view is a `next/link` navigation.
- All three pages are static (no dynamic APIs) and share one content source.
- `404` reuses the shell (vim flavour: `E37: No such page`, see [05](05-layout-shell.md)).

## Section order per view

Sections are built one at a time ([08](08-roadmap.md)). Only the hero exists in the first task.

| # | Neutral `/` | Hire `/hire` | Casual `/casual` |
|---|---|---|---|
| 1 | Hero | Hero | Hero |
| 2 | Work (demos) | Work (demos) | Now (what I'm thinking about) |
| 3 | Experience | Experience | Research & teaching |
| 4 | Research & teaching | Research & teaching | Writing (blog mirror) |
| 5 | Writing | How working together goes | Work (short) |
| 6 | Contact | Contact | Contact |

The views differ in **order, density and skin**, not only order. Example: Experience renders as
issue rows in Hire and as a commit log in Casual (see [04](04-team-tools-catalog.md)).
If a section has nothing different to say in a view, it is omitted there rather than repeated.

## Content model

Copy lives in content files, never in components (repo rule). Start with typed TypeScript data
in `src/content/`; move long-form items to Markdown later if needed.

```ts
type View = "neutral" | "hire" | "casual";

type Profile = {
  name: string;                       // "Jay Tash"
  valueLine: Record<View, string>;    // hero line per view (may be identical)
  contacts: { email?: string; cal?: string; telegram: string };
};

type Section = {
  id: string;                         // "hero", "work", ... used for anchors and the statusline
  label: string;                      // short, lowercase: "hero", "work"
  order: Partial<Record<View, number>>; // absent = not shown in that view
};

type WorkItem = {                     // later sections
  slug: string; title: string; oneLiner: string;
  role: string[];                     // e.g. ["engineering", "product", "design"]
  demoUrl?: string; period?: string;
  views: Partial<Record<View, { order: number; blurb?: string }>>;
};
```

## Blog mirror

The blog is a separate site. At build time, fetch its RSS/Atom feed and render the latest three
posts (title, date, link out). Build must not fail if the feed is unreachable; render nothing.
Feed URL: **TBD** (open question in [08](08-roadmap.md)).
