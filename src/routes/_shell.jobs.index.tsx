import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { api } from "@/services/api";
import { JobCard } from "@/components/cards/JobCard";
import { EmptyState, ErrorState, LoadingCards } from "@/components/common/States";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companies, experienceLevels, locations, skills } from "@/lib/graph-data";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/_shell/jobs/")({
  head: () => ({
    meta: [
      { title: "Explore Jobs — SkillGraph" },
      { name: "description", content: "Search and filter jobs matched to your skills through graph traversals." },
      { property: "og:title", content: "Explore Jobs — SkillGraph" },
      { property: "og:description", content: "Filter roles by location, skill, experience, company and salary." },
    ],
  }),
  component: ExploreJobs,
});

const ANY = "any";
const PER_PAGE = 6;

function ExploreJobs() {
  const q = useQuery({ queryKey: ["jobs"], queryFn: api.getJobs, retry: false });
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(ANY);
  const [skill, setSkill] = useState(ANY);
  const [exp, setExp] = useState(ANY);
  const [company, setCompany] = useState(ANY);
  const [salary, setSalary] = useState(ANY);
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const list = (q.data ?? []).filter((m) => {
      const text = `${m.job.title} ${m.company.name} ${m.job.description}`.toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;
      if (location !== ANY && m.job.location !== location) return false;
      if (exp !== ANY && m.job.experience !== exp) return false;
      if (company !== ANY && m.company.id !== company) return false;
      if (skill !== ANY && !m.job.skillIds.includes(skill)) return false;
      if (salary !== ANY && m.job.salaryMin < Number(salary)) return false;
      return true;
    });
    return list;
  }, [q.data, search, location, exp, company, skill, salary]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const reset = () => {
    setSearch(""); setLocation(ANY); setSkill(ANY); setExp(ANY); setCompany(ANY); setSalary(ANY); setPage(1);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Explore Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          {q.data ? `${results.length} roles connected to the graph` : "Traversing the graph…"}
        </p>
      </header>

      <section className="surface space-y-4 p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search job title, company or keyword…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect label="Location" value={location} onChange={setLocation} options={locations.map((l) => ({ value: l, label: l }))} />
          <FilterSelect label="Skill" value={skill} onChange={setSkill} options={skills.map((s) => ({ value: s.id, label: s.name }))} />
          <FilterSelect label="Experience" value={exp} onChange={setExp} options={experienceLevels.map((e) => ({ value: e, label: e }))} />
          <FilterSelect label="Company" value={company} onChange={setCompany} options={companies.map((c) => ({ value: c.id, label: c.name }))} />
          <FilterSelect
            label="Salary"
            value={salary}
            onChange={setSalary}
            options={[
              { value: "1500000", label: "₹15 LPA+" },
              { value: "2500000", label: "₹25 LPA+" },
              { value: "3000000", label: "₹30 LPA+" },
              { value: "3500000", label: "₹35 LPA+" },
            ]}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="size-3.5" /> Filters run as parameterized Cypher on the backend
          </span>
          <Button variant="ghost" size="sm" onClick={reset}>Clear filters</Button>
        </div>
      </section>

      {q.isError ? (
        <ErrorState onRetry={() => q.refetch()} />
      ) : q.isLoading ? (
        <LoadingCards count={6} />
      ) : slice.length === 0 ? (
        <EmptyState
          title="No jobs match these filters"
          description="Loosen a filter or clear them all to see the full graph of roles."
          action={<Button variant="outline" onClick={reset}>Clear filters</Button>}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {slice.map((m) => <JobCard key={m.job.id} m={m} />)}
          </div>
          {pages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(Math.max(1, current - 1)); }} />
                </PaginationItem>
                {Array.from({ length: pages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={i + 1 === current} onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(Math.min(pages, current + 1)); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="any">{label}: Any</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
