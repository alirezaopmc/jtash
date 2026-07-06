import { HomePage } from "@/components/sections/home-page";
import { getRequestSiteContent } from "@/lib/get-request-site-content";

export default async function Page() {
  const content = await getRequestSiteContent();

  return <HomePage {...content} />;
}
