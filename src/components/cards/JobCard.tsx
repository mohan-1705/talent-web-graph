import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin, Wallet, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchRing } from "@/components/common/Match";
import type { JobMatch } from "@/lib/graph-data";
import { toast } from "sonner";

export function JobCard({ m }: { m: JobMatch }) {
  return (
    <article className="surface flex flex-col gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold">{m.job.title}</h3>
          <Link
            to="/companies/$companyId"
            params={{ companyId: m.company.id }}
            className="text-sm font-medium text-primary hover:underline"
          >
            {m.company.name}
          </Link>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3.5" />{m.job.location}</span>
            <span className="flex items-center gap-1"><Wallet className="size-3.5" />{m.job.salary}</span>
            <span className="flex items-center gap-1"><Briefcase className="size-3.5" />{m.job.experience}</span>
          </div>
        </div>
        <MatchRing value={m.match} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {m.job.skillIds.slice(0, 5).map((id) => {
          const owned = m.matching.some((s) => s.id === id);
          const skill = [...m.matching, ...m.missing].find((s) => s.id === id)!;
          return (
            <Badge key={id} variant={owned ? "secondary" : "outline"} className="font-normal">
              {skill.name}
            </Badge>
          );
        })}
        {m.job.skillIds.length > 5 && (
          <Badge variant="outline" className="font-normal">+{m.job.skillIds.length - 5}</Badge>
        )}
      </div>

      <div className="mt-auto flex gap-2">
        <Button asChild className="flex-1">
          <Link to="/jobs/$jobId" params={{ jobId: m.job.id }}>View Job</Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Save ${m.job.title}`}
          onClick={() => toast.success("Job saved", { description: `${m.job.title} at ${m.company.name}` })}
        >
          <Bookmark className="size-4" />
        </Button>
      </div>
    </article>
  );
}
