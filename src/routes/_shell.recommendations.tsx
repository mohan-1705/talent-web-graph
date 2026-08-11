import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { api } from "@/services/api";
import { ErrorState, LoadingCards } from "@/components/common/States";
import { MatchBadge } from "@/components/common/Match";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_shell/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommendations — SkillGraph" },
      { name: "description", content: "Jobs, skills and companies recommended from your graph, each with the reason behind it." },
      { property: "og:title", content: "Recommendations — SkillGraph" },
      { property: "og:description", content: "Explainable recommendations backed by graph traversals." },
    ],
  }),
  component: Recommendations,
});

function Recommendations() {
  const q = useQuery({ queryKey: ["recs"], queryFn: api.getRecommendations, retry: false });

  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Recommended for You</h1>
        <p className="mt-1 text-muted-foreground">
          Every suggestion comes with the graph path that produced it.
        </p>
      </header>

      {q.isLoading ? (
        <LoadingCards count={6} />
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Recommended Jobs</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {q.data!.jobs.map((m) => (
                <article key={m.job.id} className="surface space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-semibold">{m.job.title}</h3>
                      <p className="text-sm text-muted-foreground">{m.company.name} · {m.job.location}</p>
                    </div>
                    <MatchBadge value={m.match} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended because you have {m.matching.slice(0, 3).map((s) => s.name).join(", ")} skills.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.matching.slice(0, 4).map((s) => (
                      <Badge key={s.id} variant="secondary" className="font-normal">{s.name}</Badge>
                    ))}
                  </div>
                  <p className="rounded-lg bg-muted/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                    (You)-[:HAS_SKILL]→({m.matching[0]?.name})-[:REQUIRED_FOR]→({m.job.title})-[:AT_COMPANY]→({m.company.name})
                  </p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to="/jobs/$jobId" params={{ jobId: m.job.id }}>View Graph Path</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/jobs/$jobId" params={{ jobId: m.job.id }}>View Job</Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Recommended Skills</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {q.data!.skills.map(({ skill, demand }) => (
                <article key={skill.id} className="surface space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-display text-base font-semibold">
                      <Sparkles className="size-4 text-node-skill" /> {skill.name}
                    </h3>
                    <Badge variant="secondary">{skill.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unlocks {demand} additional roles through REQUIRED_FOR relationships.
                  </p>
                  <Button asChild variant="outline" className="w-full"><Link to="/skills">Add to plan</Link></Button>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Recommended Companies</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {q.data!.companies.map(({ company, jobs, match }) => (
                <article key={company.id} className="surface space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-node-company/12 text-sm font-bold text-node-company">
                      {company.name.slice(0, 2).toUpperCase()}
                    </span>
                    <MatchBadge value={match} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">{company.name}</h3>
                    <p className="text-xs text-muted-foreground">{company.industry} · {jobs} open roles</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Their open roles connect to your strongest skills.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/companies/$companyId" params={{ companyId: company.id }}>View Company</Link>
                  </Button>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
