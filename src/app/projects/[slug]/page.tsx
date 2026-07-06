import { notFound } from "next/navigation";

import { CaseStudyDetail } from "@/components/projects/case-study-detail";
import {
  getCaseStudy,
  listCaseStudies,
} from "@/content/repository/content-repository";
import { getRequestSiteContent } from "@/lib/get-request-site-content";

export async function generateStaticParams() {
  const studies = await listCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ site, labels }, study] = await Promise.all([
    getRequestSiteContent(),
    getCaseStudy(slug),
  ]);

  if (!study) {
    notFound();
  }

  return <CaseStudyDetail study={study} labels={labels} routes={site.routes} />;
}
