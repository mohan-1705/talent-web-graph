import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Building2, Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import { api } from "@/services/api";
import { LoadingCards, ErrorState } from "@/components/common/States";
import { JobCard } from "@/components/cards/JobCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraphCanvas, GraphLegend } from "@/components/graph/GraphCanvas";
import { buildCareerGraph } from "@/lib/graph-build";
import { proficiencyLabel } from "@/components/cards/SkillCard";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SkillGraph" },
      { name: "description", content: "Your skills, matching jobs and graph-derived recommendations at a glance." },
      { property: "og:title", content: "Dashboard — SkillGraph" },
      { property: "og:description", content: "Skills, matching jobs and recommendations from your career graph." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const q = useQuery({ queryKey: ["dashboard"], queryFn: api.getDashboard, retry: false });
  const graph = buildCareerGraph({ skillLimit: 4, jobLimit: 4 });

  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;

  const stats = [
    { label: "Total Skills", value: q.data?.stats.skills, icon: Sparkles, tone: "text-node-skill bg-node-skill/10" },
    { label: "Matching Jobs", value: q.data?.stats.matching, icon: Briefcase, tone: "text-node-job bg-node-job/10" },
    { label: "Recommended Jobs", value: q.data?.stats.recommended, icon: Lightbulb, tone: "text-node-user bg-node-user/10" },
    { label: "Companies", value: q.data?.stats.companies, icon: Building2, tone: "text-node-company bg-node-company/10" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Good morning, Mohana 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Discover opportunities based on your skills and career goals.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="surface flex items-center gap-4 p-5">
            <span className={`grid size-11 place-items-center rounded-xl ${s.tone}`}>
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-bold tabular-nums">{s.value ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface p-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Skill overview</h2>
            <Link to="/skills" className="text-sm font-medium text-primary hover:underline">All skills</Link>
          </div>
          <div className="mt-5 space-y-4">
            {(q.data?.skills ?? []).slice(0, 6).map((s) => (
              <div key={s.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <Badge variant="secondary" className="text-[11px]">{proficiencyLabel(s.proficiency)}</Badge>
                </div>
                <Progress value={s.proficiency} className="h-2" />
              </div>
            ))}
            {q.isLoading && <p className="text-sm text-muted-foreground">Loading skills…</p>}
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recommended jobs</h2>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link to="/recommendations">See all <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          {q.isLoading ? (
            <LoadingCards count={2} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {(q.data?.recommended ?? []).map((m) => <JobCard key={m.job.id} m={m} />)}
            </div>
          )}
        </section>
      </div>

      <section className="surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg font-semibold">Career graph preview</h2>
            <p className="text-sm text-muted-foreground">User → Skills → Jobs → Companies</p>
          </div>
          <div className="flex items-center gap-4">
            <GraphLegend className="hidden sm:flex" />
            <Button asChild variant="outline" size="sm">
              <Link to="/graph">Open Graph Explorer</Link>
            </Button>
          </div>
        </div>
        <div className="h-[420px]">
          <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
        </div>
      </section>
    </div>
  );
}
