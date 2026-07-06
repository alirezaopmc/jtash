import { ProjectsIndex } from "@/components/projects/projects-index";
import { listCaseStudies } from "@/content/repository/content-repository";
import { getRequestSiteContent } from "@/lib/get-request-site-content";

export default async function ProjectsPage() {
  const [{ sections, labels, site }, items] = await Promise.all([
    getRequestSiteContent(),
    listCaseStudies(),
  ]);

  return (
    <ProjectsIndex
      items={items}
      meta={sections.projectsPage}
      labels={labels}
      routes={site.routes}
    />
  );
}
