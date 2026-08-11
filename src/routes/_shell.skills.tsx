import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { api } from "@/services/api";
import { ErrorState, LoadingCards } from "@/components/common/States";
import { SkillCard } from "@/components/cards/SkillCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { jobsForSkill, recommendedSkills, skillsToImprove } from "@/lib/graph-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/skills")({
  head: () => ({
    meta: [
      { title: "Skills — SkillGraph" },
      { name: "description", content: "Manage your skills, discover recommended skills and see which ones to improve." },
      { property: "og:title", content: "Skills — SkillGraph" },
      { property: "og:description", content: "Your skill graph: owned, recommended and skills to improve." },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const q = useQuery({ queryKey: ["userSkills"], queryFn: api.getUserSkills, retry: false });
  const recommended = recommendedSkills(6);
  const improve = skillsToImprove(5);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Skills</h1>
          <p className="mt-1 text-muted-foreground">Every skill is a node — its edges decide which jobs you see.</p>
        </div>
        <AddSkillDialog />
      </header>

      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">My Skills</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="improve">Skills to Improve</TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="mt-6">
          {q.isError ? (
            <ErrorState onRetry={() => q.refetch()} />
          ) : q.isLoading ? (
            <LoadingCards count={6} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {q.data!.map((s) => (
                <SkillCard key={s.id} skill={s} relatedJobs={jobsForSkill(s.id).length} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommended.map(({ skill, demand }) => (
              <article key={skill.id} className="surface space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold">{skill.name}</h3>
                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                  </div>
                  <Badge className="bg-primary/12 text-primary hover:bg-primary/20">+{demand} jobs</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learning {skill.name} connects you to {demand} more roles through REQUIRED_FOR edges.
                </p>
                <Button variant="outline" className="w-full" onClick={() => toast.success(`${skill.name} added to your learning list`)}>
                  Add to learning list
                </Button>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="improve" className="mt-6">
          <div className="surface divide-y divide-border">
            {improve.map(({ skill, required, jobs }) => (
              <div key={skill.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <Badge variant="secondary" className="text-[11px]">{skill.category}</Badge>
                  </div>
                  <div className="relative">
                    <Progress value={skill.proficiency} className="h-2" />
                    <span
                      className="absolute -top-1 h-4 w-0.5 rounded bg-primary"
                      style={{ left: `${required}%` }}
                      aria-hidden
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current {skill.proficiency}% · Required {required}% · {jobs.length} related jobs
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast("Practice plan created", { description: skill.name })}>
                  Improve
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddSkillDialog() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState([60]);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="size-4" /> Add Skill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a skill</DialogTitle>
          <DialogDescription>
            Creates a (:Skill) node and a HAS_SKILL edge from your user node.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill name</Label>
            <Input id="skill-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kubernetes" maxLength={40} />
          </div>
          <div className="space-y-2">
            <Label>Proficiency — {level[0]}%</Label>
            <Slider value={level} onValueChange={setLevel} max={100} step={5} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (name.trim().length < 2) { toast.error("Enter a valid skill name"); return; }
              toast.success(`${name} added`, { description: `Proficiency ${level[0]}%` });
              setName(""); setOpen(false);
            }}
          >
            Add skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
