/**
 * API service layer.
 *
 * In production these call the Express + Neo4j-driver backend:
 *   VITE_API_URL=https://skillgraph-api.onrender.com
 * The backend owns the CognoDB Cloud (Bolt 5.x) connection and all
 * parameterized openCypher queries. The frontend never talks to the DB.
 *
 * When VITE_API_URL is not set, the layer resolves against local seed data so
 * the UI is fully demoable without the backend running.
 */
import {
  allMatches, companies, currentUser, getCompany, getJob, getSkill, jobs,
  jobsForCompany, jobsForSkill, matchForJob, popularSkillsForCompany,
  recommendedCompanies, recommendedJobs, recommendedSkills, skills,
  skillsToImprove, userSkills,
} from "@/lib/graph-data";

const BASE = import.meta.env["VITE_API_URL"] as string | undefined;

export class ApiError extends Error {
  constructor(message: string, public readonly kind: "network" | "server" = "server") {
    super(message);
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function request<T>(path: string, fallback: () => T): Promise<T> {
  if (!BASE) {
    await delay(280 + Math.random() * 320);
    return fallback();
  }
  try {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) throw new ApiError(`Request failed with ${res.status}`);
    return (await res.json()) as T;
  } catch {
    throw new ApiError("Unable to connect to the graph database.", "network");
  }
}

export const api = {
  /** GET /api/users/:id */
  getUser: () => request("/api/users/u1", () => currentUser),
  /** GET /api/users/:id/skills */
  getUserSkills: () => request("/api/users/u1/skills", () => userSkills()),
  /** GET /api/jobs */
  getJobs: () => request("/api/jobs", () => allMatches()),
  /** GET /api/jobs/:id */
  getJob: (id: string) =>
    request(`/api/jobs/${id}`, () => {
      const job = getJob(id);
      if (!job) throw new ApiError("Job not found");
      return matchForJob(job);
    }),
  /** GET /api/skills */
  getSkills: () => request("/api/skills", () => skills),
  /** GET /api/skills/:id */
  getSkill: (id: string) =>
    request(`/api/skills/${id}`, () => ({ skill: getSkill(id)!, jobs: jobsForSkill(id) })),
  /** GET /api/companies */
  getCompanies: () =>
    request("/api/companies", () =>
      companies.map((c) => ({
        company: c,
        jobs: jobsForCompany(c.id),
        skills: popularSkillsForCompany(c.id),
      })),
    ),
  /** GET /api/companies/:id */
  getCompany: (id: string) =>
    request(`/api/companies/${id}`, () => ({
      company: getCompany(id)!,
      jobs: jobsForCompany(id).map(matchForJob),
      skills: popularSkillsForCompany(id, 8),
    })),
  /** GET /api/recommendations/:userId */
  getRecommendations: () =>
    request("/api/recommendations/u1", () => ({
      jobs: recommendedJobs(6),
      skills: recommendedSkills(6),
      companies: recommendedCompanies(4),
      improve: skillsToImprove(5),
    })),
  /** GET /api/dashboard summary (users/:id + aggregates) */
  getDashboard: () =>
    request("/api/users/u1/dashboard", () => ({
      user: currentUser,
      skills: userSkills(),
      recommended: recommendedJobs(4),
      stats: {
        skills: userSkills().length,
        matching: allMatches().filter((m) => m.match >= 50).length,
        recommended: 6,
        companies: companies.length,
        jobs: jobs.length,
      },
    })),
};
