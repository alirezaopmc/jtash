const JTASH_IR_NAME = "Jay Tash";
const DEFAULT_NAME = "Alireza Jafartash";

const JTASH_IR_INITIALS = "JT";
const DEFAULT_INITIALS = "AJ";

export const SITE_META_DESCRIPTION =
  "Senior Software Engineer | AI Systems & Workflows";

export function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().split(":")[0] ?? "";
}

export function isJtashIrHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return (
    host === "jtash.ir" || host === "www.jtash.ir" || host.endsWith(".jtash.ir")
  );
}

export function resolveDisplayName(hostname?: string): string {
  if (hostname && isJtashIrHost(hostname)) {
    return JTASH_IR_NAME;
  }

  return DEFAULT_NAME;
}

export function resolveDisplayInitials(hostname?: string): string {
  if (hostname && isJtashIrHost(hostname)) {
    return JTASH_IR_INITIALS;
  }

  return DEFAULT_INITIALS;
}

const JTASH_IR_LOCATION = "Istanbul, Turkiye";
const DEFAULT_LOCATION = "Tehran, Iran";

export function resolveDisplayLocation(hostname?: string): string {
  if (hostname && isJtashIrHost(hostname)) {
    return JTASH_IR_LOCATION;
  }

  return DEFAULT_LOCATION;
}

export function resolveDisplayMetaDescription(_hostname?: string): string {
  return SITE_META_DESCRIPTION;
}
