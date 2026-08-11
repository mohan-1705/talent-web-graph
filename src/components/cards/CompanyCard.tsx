import { Link } from "@tanstack/react-router";
import { Building2, MapPin, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Company, Job, Skill } from "@/lib/graph-data";

export function CompanyCard({ company, jobs, skills }: { company: Company; jobs: Job[]; skills: Skill[] }) {
  return (
    <article className="surface flex flex-col gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-node-company/12 font-display text-lg font-bold text-node-company">
          {company.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold">{company.name}</h3>
          <p className="truncate text-sm text-muted-foreground">{company.industry}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="size-3.5" />{company.location}</span>
        <span className="flex items-center gap-1"><Briefcase className="size-3.5" />{jobs.length} open roles</span>
        <span className="flex items-center gap-1"><Building2 className="size-3.5" />{company.size}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <Badge key={s.id} variant="secondary" className="font-normal">{s.name}</Badge>
        ))}
      </div>
      <Button asChild variant="outline" className="mt-auto">
        <Link to="/companies/$companyId" params={{ companyId: company.id }}>View Company</Link>
      </Button>
    </article>
  );
}
