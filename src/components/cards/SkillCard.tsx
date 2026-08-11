import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Skill } from "@/lib/graph-data";

export function proficiencyLabel(p: number) {
  if (p >= 85) return "Expert";
  if (p >= 70) return "Advanced";
  if (p >= 45) return "Intermediate";
  return "Beginner";
}

export function SkillCard({
  skill,
  relatedJobs,
  footer,
}: {
  skill: Skill;
  relatedJobs?: number;
  footer?: React.ReactNode;
}) {
  return (
    <article className="surface flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold">{skill.name}</h3>
          <p className="text-xs text-muted-foreground">{skill.category}</p>
        </div>
        <Badge variant="secondary">{proficiencyLabel(skill.proficiency)}</Badge>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Proficiency</span>
          <span className="font-medium text-foreground">{skill.proficiency}%</span>
        </div>
        <Progress value={skill.proficiency} className="h-2" />
      </div>
      {relatedJobs !== undefined && (
        <p className="text-xs text-muted-foreground">
          Connected to <span className="font-semibold text-foreground">{relatedJobs}</span> jobs in the graph
        </p>
      )}
      {footer}
    </article>
  );
}
