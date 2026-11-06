const links = [
  {
    label: "GitHub",
    handle: "alirezaopmc",
    href: "https://github.com/alirezaopmc",
    icon: "/icons/social/github.svg",
  },
  {
    label: "LinkedIn",
    handle: "alirezaopmc",
    href: "https://www.linkedin.com/in/alirezaopmc",
    icon: "/icons/social/linkedin.svg",
  },
  {
    label: "Telegram",
    handle: "alirezaopmc",
    href: "https://t.me/alirezaopmc",
    icon: "/icons/social/telegram.svg",
  },
  {
    label: "Email",
    handle: "alirezaopmc",
    href: "mailto:alirezaopmc@gmail.com",
    icon: "/icons/social/gmail.svg",
  },
] as const;

/**
 * A vertical rail keeps the services scannable without printing the same handle four times.
 * Hover or keyboard-focus expands one pill leftward to reveal the shared handle.
 */
export function SocialLinks() {
  return (
    <>
      <nav
        aria-label="Contact and social links"
        className="absolute top-7 right-5 hidden flex-col items-end gap-2 sm:flex md:top-9 md:right-10"
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={`${link.label}: ${link.handle}`}
            title={`${link.label} · ${link.handle}`}
            className="group flex h-10 w-10 items-center justify-end overflow-hidden rounded-full border border-white/[0.09] bg-ink/80 px-[9px] text-[11px] text-muted transition-[width,border-color,background-color,color] duration-300 hover:w-40 hover:border-white/20 hover:bg-panel hover:text-fg focus-visible:w-40 focus-visible:border-white/25 focus-visible:bg-panel focus-visible:text-fg focus-visible:outline-none"
          >
            <span className="mr-3 translate-x-2 whitespace-nowrap opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
              {link.handle}
            </span>
            <img
              src={link.icon}
              alt=""
              className="size-5 shrink-0 opacity-75 group-hover:opacity-100"
            />
          </a>
        ))}
      </nav>

      <nav
        aria-label="Contact and social links"
        className="mt-5 flex gap-2 sm:hidden"
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={`${link.label}: ${link.handle}`}
            title={`${link.label} · ${link.handle}`}
            className="grid size-9 place-items-center rounded-full border border-white/[0.09] bg-ink/80 transition-colors hover:border-white/20 hover:bg-panel"
          >
            <img src={link.icon} alt="" className="size-[18px] opacity-80" />
          </a>
        ))}
      </nav>
    </>
  );
}
