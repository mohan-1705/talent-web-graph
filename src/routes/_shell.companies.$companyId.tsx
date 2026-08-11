import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, MapPin, Users } from "lucide-react";
import { api } from "@/services/api";
import { ErrorState } from "@/components/common/States";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/cards/JobCard";
import { GraphCanvas, GraphLegend } from "@/components/graph/GraphCanvas";
import { buildCompanyGraph } from "@/lib/graph-build";

export const Route = createFileRoute("/_shell/companies/$companyId")({
  head: () => ({
    meta: [
      { title: "Company details — SkillGraph" },
      { name: "description", content: "Company profile with open roles, required skills and the graph connecting them." },
      { property: "og:title", content: "Company details — SkillGraph" },
      { property: "og:description", content: "Company → Jobs → Required Skills, visualised." },
    ],
  }),
  component: CompanyDetails,
});

function CompanyDetails() {
  const { companyId } = Route.useParams();
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ["company", companyId], queryFn: () => api.getCompany(companyId), retry: false });

  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;
  if (q.isLoading || !q.data) return <Skeleton className="h-96 w-full rounded-xl" />;

  const { company, jobs, skills } = q.data;
  const graph = buildCompanyGraph(company.id);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 gap-1.5" onClick={() => navigate({ to: "/companies" })}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <section className="surface flex flex-wrap items-center gap-5 p-6">
        <span className="grid size-16 place-items-center rounded-2xl bg-node-company/12 font-display text-xl font-bold text-node-company">
          {company.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-sm text-muted-foreground">{company.about}</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Building2 className="size-3.5" />{company.industry}</span>
            <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{company.location}</span>
            <span className="flex items-center gap-1.5"><Users className="size-3.5" />{company.size}</span>
          </div>
        </div>
      </section>

      <section className="surface space-y-3 p-5">
        <h2 className="font-display text-base font-semibold">Skills they hire for</h2>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => <Badge key={s.id} variant="secondary" className="font-normal">{s.name}</Badge>)}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Open roles ({jobs.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((m) => <JobCard key={m.job.id} m={m} />)}
        </div>
      </section>

      <section className="surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg font-semibold">Company graph</h2>
            <p className="text-sm text-muted-foreground">Company → Jobs → Required Skills → Candidates</p>
          </div>
          <GraphLegend className="hidden md:flex" />
        </div>
        <div className="h-[460px]">
          <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
        </div>
      </section>
    </div>
  );
}
