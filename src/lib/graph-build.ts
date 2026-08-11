import type { Edge } from "@xyflow/react";
import type { GraphNode } from "@/components/graph/GraphCanvas";
import { edge } from "@/components/graph/GraphCanvas";
import {
  appliedJobIds, currentUser, getCompany, getSkill, interestedJobIds, jobs,
  matchForJob, relatedTo, userSkillIds, type Job, type Skill,
} from "@/lib/graph-data";

const COL = { User: 0, Skill: 280, Job: 600, Company: 940 } as const;
const ROW = 96;

function column(items: string[], x: number, offset = 0) {
  const total = items.length;
  return items.map((_, i) => ({ x, y: (i - (total - 1) / 2) * ROW + offset }));
}

export interface BuiltGraph {
  nodes: GraphNode[];
  edges: Edge[];
}

/**
 * Multi-hop traversal: (User)-[:HAS_SKILL]->(Skill)-[:REQUIRED_FOR]->(Job)-[:AT_COMPANY]->(Company)
 */
export function buildCareerGraph({
  skillLimit = 6,
  jobLimit = 5,
  types = ["User", "Skill", "Job", "Company"],
  focusSkillId,
  includeRelated = false,
  includeApplications = false,
}: {
  skillLimit?: number;
  jobLimit?: number;
  types?: string[];
  focusSkillId?: string;
  includeRelated?: boolean;
  includeApplications?: boolean;
} = {}): BuiltGraph {
  const nodes: GraphNode[] = [];
  const edges: Edge[] = [];

  const topSkills: Skill[] = focusSkillId
    ? [getSkill(focusSkillId)!]
    : userSkillIds
        .map((id) => getSkill(id)!)
        .sort((a, b) => b.proficiency - a.proficiency)
        .slice(0, skillLimit);

  const topJobs: Job[] = jobs
    .filter((j) => j.skillIds.some((s) => topSkills.some((t) => t.id === s)))
    .map(matchForJob)
    .sort((a, b) => b.match - a.match)
    .slice(0, jobLimit)
    .map((m) => m.job);

  const companyIds = [...new Set(topJobs.map((j) => j.companyId))];

  const showUser = types.includes("User");
  const showSkill = types.includes("Skill");
  const showJob = types.includes("Job");
  const showCompany = types.includes("Company");

  if (showUser) {
    nodes.push({
      id: "u1",
      type: "graphNode",
      position: { x: COL.User, y: 0 },
      data: { label: currentUser.name, type: "User", sub: currentUser.title, refId: "u1" },
    });
  }

  if (showSkill) {
    const pos = column(topSkills.map((s) => s.id), COL.Skill);
    topSkills.forEach((s, i) => {
      nodes.push({
        id: s.id,
        type: "graphNode",
        position: pos[i]!,
        data: { label: s.name, type: "Skill", sub: s.category, refId: s.id },
      });
      if (showUser) edges.push(edge(`u1-${s.id}`, "u1", s.id, "HAS_SKILL", true));
    });

    if (includeRelated) {
      const seen = new Set(topSkills.map((s) => s.id));
      topSkills.slice(0, 3).forEach((s, si) => {
        relatedTo(s.id)
          .filter((r) => !seen.has(r.id))
          .slice(0, 1)
          .forEach((r) => {
            seen.add(r.id);
            nodes.push({
              id: r.id,
              type: "graphNode",
              position: { x: COL.Skill - 40, y: (si - 1) * ROW + 380 },
              data: { label: r.name, type: "Skill", sub: "related", refId: r.id },
            });
            edges.push(edge(`${s.id}-${r.id}`, s.id, r.id, "RELATED_TO"));
          });
      });
    }
  }

  if (showJob) {
    const pos = column(topJobs.map((j) => j.id), COL.Job);
    topJobs.forEach((j, i) => {
      nodes.push({
        id: j.id,
        type: "graphNode",
        position: pos[i]!,
        data: { label: j.title, type: "Job", sub: j.location.split(",")[0] ?? j.location, refId: j.id },
      });
      if (showSkill) {
        j.skillIds
          .filter((s) => nodes.some((n) => n.id === s))
          .forEach((s) => edges.push(edge(`${s}-${j.id}`, s, j.id, "REQUIRED_FOR")));
      }
      if (includeApplications && showUser) {
        if (appliedJobIds.includes(j.id)) edges.push(edge(`u1-app-${j.id}`, "u1", j.id, "APPLIED_TO"));
        else if (interestedJobIds.includes(j.id)) edges.push(edge(`u1-int-${j.id}`, "u1", j.id, "INTERESTED_IN"));
      }
    });
  }

  if (showCompany) {
    const pos = column(companyIds, COL.Company);
    companyIds.forEach((cid, i) => {
      const c = getCompany(cid)!;
      nodes.push({
        id: c.id,
        type: "graphNode",
        position: pos[i]!,
        data: { label: c.name, type: "Company", sub: c.industry, refId: c.id },
      });
      if (showJob) {
        topJobs
          .filter((j) => j.companyId === cid)
          .forEach((j) => edges.push(edge(`${j.id}-${cid}`, j.id, cid, "AT_COMPANY")));
      }
    });
  }

  return { nodes, edges };
}

/** A single explanatory path: User → Skill → Job → Company */
export function buildJobPath(jobId: string): BuiltGraph {
  const m = matchForJob(jobs.find((j) => j.id === jobId)!);
  const nodes: GraphNode[] = [
    { id: "u1", type: "graphNode", position: { x: 0, y: 0 }, data: { label: currentUser.name, type: "User", sub: currentUser.title } },
  ];
  const edges: Edge[] = [];
  const shown = m.matching.slice(0, 3);
  shown.forEach((s, i) => {
    nodes.push({
      id: s.id,
      type: "graphNode",
      position: { x: 260, y: (i - (shown.length - 1) / 2) * 90 },
      data: { label: s.name, type: "Skill", sub: s.category },
    });
    edges.push(edge(`u-${s.id}`, "u1", s.id, "HAS_SKILL", true));
    edges.push(edge(`${s.id}-job`, s.id, m.job.id, "REQUIRED_FOR", true));
  });
  nodes.push({
    id: m.job.id,
    type: "graphNode",
    position: { x: 540, y: 0 },
    data: { label: m.job.title, type: "Job", sub: `${m.match}% match` },
  });
  nodes.push({
    id: m.company.id,
    type: "graphNode",
    position: { x: 820, y: 0 },
    data: { label: m.company.name, type: "Company", sub: m.company.industry },
  });
  edges.push(edge("job-co", m.job.id, m.company.id, "AT_COMPANY", true));
  return { nodes, edges };
}

/** Company → Jobs → Required Skills */
export function buildCompanyGraph(companyId: string): BuiltGraph {
  const c = getCompany(companyId)!;
  const cJobs = jobs.filter((j) => j.companyId === companyId);
  const nodes: GraphNode[] = [
    { id: c.id, type: "graphNode", position: { x: 0, y: 0 }, data: { label: c.name, type: "Company", sub: c.industry } },
  ];
  const edges: Edge[] = [];
  const skillSeen = new Map<string, number>();
  cJobs.forEach((j, i) => {
    const y = (i - (cJobs.length - 1) / 2) * 150;
    nodes.push({ id: j.id, type: "graphNode", position: { x: 300, y }, data: { label: j.title, type: "Job", sub: j.experience } });
    edges.push(edge(`${j.id}-c`, j.id, c.id, "AT_COMPANY"));
    j.skillIds.slice(0, 3).forEach((sid, k) => {
      if (!skillSeen.has(sid)) {
        skillSeen.set(sid, skillSeen.size);
        const s = getSkill(sid)!;
        nodes.push({
          id: sid,
          type: "graphNode",
          position: { x: 620, y: (skillSeen.get(sid)! - 3) * 84 + k },
          data: { label: s.name, type: "Skill", sub: s.category },
        });
      }
      edges.push(edge(`${sid}-${j.id}`, sid, j.id, "REQUIRED_FOR"));
    });
  });
  return { nodes, edges };
}

/** Profile skill constellation: user at centre, skills radiating out. */
export function buildSkillConstellation(): BuiltGraph {
  const top = userSkillIds.map((id) => getSkill(id)!).sort((a, b) => b.proficiency - a.proficiency).slice(0, 10);
  const nodes: GraphNode[] = [
    { id: "u1", type: "graphNode", position: { x: 0, y: 0 }, data: { label: currentUser.name, type: "User", sub: currentUser.title } },
  ];
  const edges: Edge[] = [];
  top.forEach((s, i) => {
    const angle = (i / top.length) * Math.PI * 2;
    nodes.push({
      id: s.id,
      type: "graphNode",
      position: { x: Math.cos(angle) * 380, y: Math.sin(angle) * 240 },
      data: { label: s.name, type: "Skill", sub: `${s.proficiency}%` },
    });
    edges.push(edge(`u-${s.id}`, "u1", s.id, "HAS_SKILL"));
  });
  return { nodes, edges };
}
