export const shell = {
  navLabel: "Site",
  modeOrder: ["casual", "hire"],
  modes: {
    casual: { label: "casual", href: "/casual" },
    hire: { label: "hire", href: "/hire" },
  },
  homeHref: "/",
  buffer: {
    prefix: "~/jtash/",
    section: "hero",
  },
  position: "Top",
} as const;

export const notFound = {
  message: "E37: No such page",
  homeLabel: ":home",
  homeHref: "/",
} as const;
