import type { Metadata } from "next";

import { ViewPage } from "@/components/view-page";
import { profile, profileTitle } from "@/content/profile";

export const metadata: Metadata = {
  title: profileTitle("casual"),
  description: profile.valueLine.casual,
};

export default function CasualPage() {
  return <ViewPage view="casual" />;
}
