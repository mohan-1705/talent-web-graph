import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Briefcase, MapPin, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraphCanvas, GraphLegend } from "@/components/graph/GraphCanvas";
import { buildSkillConstellation } from "@/lib/graph-build";
import { currentUser, userSkills } from "@/lib/graph-data";

export const Route = createFileRoute("/_shell/profile")({
  head: () => ({
    meta: [
      { title: "Profile — SkillGraph" },
      { name: "description", content: "Your education, experience, projects, career interests and personal skill graph." },
      { property: "og:title", content: "Profile — SkillGraph" },
      { property: "og:description", content: "Your professional profile and skill constellation." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const skills = userSkills().sort((a, b) => b.proficiency - a.proficiency);
  const graph = buildSkillConstellation();

  return (
    <div className="space-y-6">
      <section className="surface flex flex-wrap items-center gap-5 p-6">
        <span className="grid size-20 place-items-center rounded-2xl bg-primary font-display text-2xl font-bold text-primary-foreground">
          {currentUser.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{currentUser.name}</h1>
          <p className="text-muted-foreground">{currentUser.title}</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="size-3.5" />{currentUser.email}</span>
            <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{currentUser.location}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="surface space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold">Background</h2>
            <div className="flex gap-3">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Education</p>
                <p className="text-sm text-muted-foreground">{currentUser.education}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Briefcase className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Experience</p>
                <p className="text-sm text-muted-foreground">{currentUser.experience}</p>
              </div>
            </div>
          </section>

          <section className="surface space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold">Projects</h2>
            {currentUser.projects.map((p) => (
              <div key={p.name} className="rounded-xl border border-border p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>)}
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="space-y-6">
          <section className="surface space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold">Top skills</h2>
            {skills.slice(0, 8).map((s) => (
              <div key={s.id} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.proficiency}%</span>
                </div>
                <Progress value={s.proficiency} className="h-2" />
              </div>
            ))}
          </section>

          <section className="surface space-y-3 p-6">
            <h2 className="font-display text-lg font-semibold">Career interests</h2>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.interests.map((i) => <Badge key={i} variant="secondary" className="font-normal">{i}</Badge>)}
            </div>
            <h3 className="pt-2 text-sm font-semibold">Preferred roles</h3>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.preferredRoles.map((r) => <Badge key={r} variant="outline" className="font-normal">{r}</Badge>)}
            </div>
          </section>
        </div>
      </div>

      <section className="surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg font-semibold">Skill graph</h2>
            <p className="text-sm text-muted-foreground">(You)-[:HAS_SKILL]→(Skill)</p>
          </div>
          <GraphLegend className="hidden md:flex" />
        </div>
        <div className="h-[440px]">
          <GraphCanvas nodes={graph.nodes} edges={graph.edges} />
        </div>
      </section>
    </div>
  );
}
