import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, Maximize2, RotateCcw, Search, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { GraphCanvas, GraphLegend, nodeTypeColor, type GraphNode } from "@/components/graph/GraphCanvas";
import { buildCareerGraph } from "@/lib/graph-build";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/States";
import {
  currentUser, getCompany, getJob, getSkill, jobsForSkill, relatedTo, type NodeType,
} from "@/lib/graph-data";

export const Route = createFileRoute("/_shell/graph")({
  head: () => ({
    meta: [
      { title: "Graph Explorer — SkillGraph" },
      { name: "description", content: "Interactively traverse users, skills, jobs and companies with multi-hop graph paths." },
      { property: "og:title", content: "Graph Explorer — SkillGraph" },
      { property: "og:description", content: "Explore HAS_SKILL, REQUIRED_FOR and AT_COMPANY relationships live." },
    ],
  }),
  component: GraphExplorer,
});

const ALL_TYPES: NodeType[] = ["User", "Skill", "Job", "Company"];

function GraphExplorer() {
  const [types, setTypes] = useState<NodeType[]>(ALL_TYPES);
  const [depth, setDepth] = useState([5]);
  const [related, setRelated] = useState(false);
  const [applications, setApplications] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [version, setVersion] = useState(0);

  const graph = useMemo(
    () =>
      buildCareerGraph({
        skillLimit: depth[0]! + 1,
        jobLimit: depth[0]!,
        types,
        includeRelated: related,
        includeApplications: applications,
      }),
    [types, depth, related, applications],
  );

  const nodes = useMemo(
    () =>
      graph.nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          dimmed: search ? !n.data.label.toLowerCase().includes(search.toLowerCase()) : false,
        },
      })),
    [graph.nodes, search],
  );

  const connections = useMemo(() => {
    if (!selected) return [];
    return graph.edges
      .filter((e) => e.source === selected.id || e.target === selected.id)
      .map((e) => {
        const otherId = e.source === selected.id ? e.target : e.source;
        const other = graph.nodes.find((n) => n.id === otherId);
        return { rel: String(e.label), node: other, direction: e.source === selected.id ? "out" : "in" };
      });
  }, [selected, graph]);

  const toggleType = (t: NodeType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Graph Explorer</h1>
          <p className="mt-1 text-muted-foreground">
            Multi-hop traversal: <span className="font-medium text-foreground">User → Skill → Job → Company</span>
          </p>
        </div>
        <GraphLegend />
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="surface overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
            <div className="relative min-w-[180px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search node…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 pl-9" />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-9" aria-label="Zoom in" onClick={() => setVersion((v) => v + 1)}>
                <ZoomIn className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-9" aria-label="Zoom out" onClick={() => setVersion((v) => v + 1)}>
                <ZoomOut className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-9" aria-label="Fit view" onClick={() => setVersion((v) => v + 1)}>
                <Maximize2 className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5"
                onClick={() => {
                  setTypes(ALL_TYPES); setDepth([5]); setRelated(false); setApplications(true);
                  setSearch(""); setSelected(null); setVersion((v) => v + 1);
                }}
              >
                <RotateCcw className="size-4" /> Reset
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-b border-border px-4 py-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Filter className="size-3.5" /> Filter
            </span>
            {ALL_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  types.includes(t) ? "border-transparent bg-secondary" : "border-border text-muted-foreground opacity-60"
                }`}
              >
                <span className="size-2 rounded-full" style={{ background: nodeTypeColor[t] }} />
                {t}
              </button>
            ))}
            <div className="flex min-w-[160px] flex-1 items-center gap-3">
              <Label className="whitespace-nowrap text-xs text-muted-foreground">Expand ({depth[0]})</Label>
              <Slider value={depth} onValueChange={setDepth} min={2} max={8} step={1} />
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch checked={related} onCheckedChange={setRelated} /> RELATED_TO
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch checked={applications} onCheckedChange={setApplications} /> Applications
            </label>
          </div>

          <div className="h-[560px]">
            <GraphCanvas
              nodes={nodes}
              edges={graph.edges}
              onSelect={setSelected}
              fitViewKey={`${version}-${types.join()}-${depth[0]}-${related}-${applications}`}
            />
          </div>
        </section>

        <aside className="surface flex max-h-[720px] flex-col overflow-hidden">
          <div className="border-b border-border p-4">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold">
              <Share2 className="size-4 text-primary" /> Node details
            </h2>
          </div>
          {!selected ? (
            <div className="p-4">
              <EmptyState
                title="Select a node"
                description="Click any node in the canvas to inspect its properties and relationships."
              />
            </div>
          ) : (
            <div className="space-y-5 overflow-y-auto p-4">
              <div>
                <Badge style={{ background: `color-mix(in oklab, ${nodeTypeColor[selected.data.type]} 14%, transparent)`, color: nodeTypeColor[selected.data.type] }}>
                  {selected.data.type}
                </Badge>
                <h3 className="mt-2 font-display text-lg font-semibold">{selected.data.label}</h3>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Properties</p>
                <dl className="space-y-1.5 text-sm">
                  {Object.entries(propertiesFor(selected)).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Connected nodes ({connections.length})
                </p>
                <ul className="space-y-2">
                  {connections.map((c, i) => (
                    <li key={i} className="rounded-lg border border-border p-2.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold">{c.rel}</span>
                        <span className="text-muted-foreground">{c.direction === "out" ? "→" : "←"}</span>
                      </div>
                      <p className="mt-1 truncate text-sm font-medium">{c.node?.data.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function propertiesFor(node: GraphNode): Record<string, string> {
  const id = node.id;
  switch (node.data.type) {
    case "User":
      return { id, name: currentUser.name, email: currentUser.email, experience: currentUser.experience };
    case "Skill": {
      const s = getSkill(id);
      return s ? { id, name: s.name, category: s.category, proficiency: `${s.proficiency}%`, jobs: String(jobsForSkill(s.id).length), related: String(relatedTo(s.id).length) } : { id };
    }
    case "Job": {
      const j = getJob(id);
      return j ? { id, title: j.title, location: j.location, experience: j.experience, salary: j.salary } : { id };
    }
    case "Company": {
      const c = getCompany(id);
      return c ? { id, name: c.name, industry: c.industry, location: c.location, size: c.size } : { id };
    }
  }
}
