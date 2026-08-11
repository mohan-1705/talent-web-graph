import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bookmark, Briefcase, Check, MapPin, Plus, Wallet } from "lucide-react";
import { api } from "@/services/api";
import { ErrorState } from "@/components/common/States";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchRing } from "@/components/common/Match";
import { GraphCanvas, GraphLegend } from "@/components/graph/GraphCanvas";
import { buildJobPath } from "@/lib/graph-build";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/jobs/$jobId")({
  head: () => ({
    meta: [
      { title: "Job details — SkillGraph" },
      { name: "description", content: "See required skills, your matching skills, missing skills and the graph path that explains the match." },
      { property: "og:title", content: "Job details — SkillGraph" },
      { property: "og:description", content: "Why this job matches you, shown as a graph path." },
    ],
  }),
  component: JobDetails,
});

function JobDetails() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ["job", jobId], queryFn: () => api.getJob(jobId), retry: false });

  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;
  if (q.isLoading || !q.data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  const m = q.data;
  const path = buildJobPath(m.job.id);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={() => navigate({ to: "/jobs" })}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <section className="surface p-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">{m.job.title}</h1>
            <Link to="/companies/$companyId" params={{ companyId: m.company.id }} className="text-primary hover:underline">
              {m.company.name} · {m.company.industry}
            </Link>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="size-4" />{m.job.location}</span>
              <span className="flex items-center gap-1.5"><Wallet className="size-4" />{m.job.salary}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="size-4" />{m.job.experience}</span>
              <span>Posted {m.job.posted}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MatchRing value={m.match} size={72} />
            <div className="flex flex-col gap-2">
              <Button onClick={() => toast.success("Application submitted", { description: m.job.title })}>Apply</Button>
              <Button variant="outline" className="gap-2" onClick={() => toast.success("Job saved")}>
                <Bookmark className="size-4" /> Save Job
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface space-y-4 p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">About this role</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{m.job.description}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You will work alongside a cross-functional team of engineers, designers and product managers,
            owning features from technical design through to production rollout and measurement.
          </p>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Required skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {[...m.matching, ...m.missing].map((s) => (
                <Badge key={s.id} variant="outline" className="font-normal">{s.name}</Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="surface space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold">Your fit</h2>
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-success">
              <Check className="size-4" /> Matching skills ({m.matching.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {m.matching.map((s) => (
                <Badge key={s.id} className="bg-success/12 font-normal text-success hover:bg-success/20">{s.name}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-warning-foreground">
              <Plus className="size-4" /> Missing skills ({m.missing.length})
            </h3>
            {m.missing.length ? (
              <div className="flex flex-wrap gap-1.5">
                {m.missing.map((s) => (
                  <Badge key={s.id} variant="outline" className="border-warning/50 font-normal">{s.name}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You cover every required skill.</p>
            )}
          </div>
        </section>
      </div>

      <section className="surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg font-semibold">Why this job matches you</h2>
            <p className="text-sm text-muted-foreground">
              Traversal: You →{" "}
              {m.matching.slice(0, 3).map((s) => s.name).join(" / ")} → {m.job.title} → {m.company.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <GraphLegend className="hidden md:flex" />
            <Button asChild variant="outline" size="sm"><Link to="/graph">View Graph</Link></Button>
          </div>
        </div>
        <div className="h-[380px]">
          <GraphCanvas nodes={path.nodes} edges={path.edges} />
        </div>
      </section>
    </div>
  );
}
