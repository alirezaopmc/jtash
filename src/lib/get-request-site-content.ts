import { headers } from "next/headers";
import { cache } from "react";

import { getSiteContent } from "@/content/repository/content-repository";
import type { SiteContent } from "@/types/content";

export const getRequestSiteContent = cache(async (): Promise<SiteContent> => {
  const host = (await headers()).get("host") ?? undefined;

  return getSiteContent(host);
});
