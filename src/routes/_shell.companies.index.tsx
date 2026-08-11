import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { CompanyCard } from "@/components/cards/CompanyCard";
import { ErrorState, LoadingCards } from "@/components/common/States";

export const Route = createFileRoute("/_shell/companies/")({
  head: () => ({
    meta: [
      { title: "Companies — SkillGraph" },
      { name: "description", content: "Browse companies, their open roles and the skills they hire for." },
      { property: "og:title", content: "Companies — SkillGraph" },
      { property: "og:description", content: "Company → Jobs → Required Skills → Candidates." },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const q = useQuery({ queryKey: ["companies"], queryFn: api.getCompanies, retry: false });
  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Companies</h1>
        <p className="mt-1 text-muted-foreground">Each company node connects to jobs, and jobs to the skills they need.</p>
      </header>
      {q.isLoading ? (
        <LoadingCards count={6} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {q.data!.map((c) => (
            <CompanyCard key={c.company.id} company={c.company} jobs={c.jobs} skills={c.skills} />
          ))}
        </div>
      )}
    </div>
  );
}
