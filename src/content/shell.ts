export const shell = {
  navLabel: "Site",
  modeOrder: ["casual", "hire"],
  modes: {
    casual: { label: "casual", href: "/casual" },
    hire: { label: "hire", href: "/hire" },
  },
  homeHref: "/",
  neutralLabel: "normal",
  buffer: {
    prefix: "~/jtash/",
    section: "hero",
  },
  meta: "utf-8 · en",
  position: "Top",
} as const;

export const notFound = {
  message: "E37: No such page",
  homeLabel: ":home",
  homeHref: "/",
} as const;
