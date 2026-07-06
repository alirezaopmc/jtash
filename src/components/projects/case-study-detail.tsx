import { Card, CardContent } from "@orbit/ui";
import { BackLink } from "@/components/layout/back-link";
import type { CaseStudy, SiteRoutes, UiLabels } from "@/types/content";
import { StackTagList } from "../stack-tag";

export interface CaseStudyDetailProps {
  study: CaseStudy;
  labels: UiLabels;
  routes: SiteRoutes;
}

export function CaseStudyDetail({
  study,
  labels,
  routes,
}: CaseStudyDetailProps) {
  return (
    <article className="mx-auto max-w-4xl px-6 py-24 lg:px-12">
      <div className="mb-8">
        <BackLink href={routes.projects}>{labels.projects.backLink}</BackLink>
      </div>

      <header className="mb-12 border-b border-border pb-8">
        <p className="mono-label mb-4 text-primary">
          {study.context.toUpperCase()}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {study.title}
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {study.short}
        </p>
      </header>

      <div className="mb-12 grid grid-cols-2 gap-0 border border-border md:grid-cols-4">
        {study.metrics.map((metric) => (
          <Card
            key={metric.label}
            className="gap-0 rounded-none border-0 border-r border-border bg-card py-0 shadow-none max-md:[&:nth-child(2n)]:border-r-0 md:[&:nth-child(4n)]:border-r-0"
          >
            <CardContent className="p-6">
              <p className="mono-label text-muted-foreground">
                {metric.label.toUpperCase()}
              </p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="mono-label mb-4 text-primary">
            {labels.caseStudy.challenge}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {study.challenge}
          </p>
        </section>
        <section>
          <h2 className="mono-label mb-4 text-primary">
            {labels.caseStudy.solution}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {study.solution}
          </p>
        </section>
        <section>
          <h2 className="mono-label mb-4 text-primary">
            {labels.caseStudy.result}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {study.result}
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <p className="mono-label mb-4 text-muted-foreground">
          {labels.caseStudy.stack}
        </p>
        <StackTagList items={study.stack} />
      </div>
    </article>
  );
}
