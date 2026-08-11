// Seed graph data mirroring the CognoDB (openCypher) graph model.
// Nodes: User, Skill, Job, Company
// Rels: HAS_SKILL, REQUIRED_FOR, AT_COMPANY, APPLIED_TO, INTERESTED_IN, RELATED_TO

export type NodeType = "User" | "Skill" | "Job" | "Company";
export type RelType =
  | "HAS_SKILL"
  | "REQUIRED_FOR"
  | "AT_COMPANY"
  | "APPLIED_TO"
  | "INTERESTED_IN"
  | "RELATED_TO";

export interface User {
  id: string;
  name: string;
  email: string;
  education: string;
  experience: string;
  title: string;
  location: string;
  interests: string[];
  preferredRoles: string[];
  projects: { name: string; description: string; stack: string[] }[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
}

export interface Job {
  id: string;
  title: string;
  location: string;
  experience: string;
  salary: string;
  salaryMin: number;
  description: string;
  companyId: string;
  skillIds: string[];
  posted: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  about: string;
}

export const currentUser: User = {
  id: "u1",
  name: "Mohana",
  email: "mohana@skillgraph.dev",
  education: "B.Tech, Computer Science — Anna University (2023)",
  experience: "2 years — Full-Stack Engineer",
  title: "Full-Stack Engineer",
  location: "Bengaluru, India",
  interests: ["Graph databases", "Developer tooling", "AI products"],
  preferredRoles: ["Full Stack Developer", "Frontend Engineer", "Platform Engineer"],
  projects: [
    {
      name: "SkillGraph",
      description: "Graph-powered career intelligence platform on CognoDB Cloud.",
      stack: ["React", "TypeScript", "Node.js", "openCypher"],
    },
    {
      name: "Realtime Analytics Board",
      description: "Streaming dashboard with websocket fan-out and time-series rollups.",
      stack: ["React", "Node.js", "PostgreSQL"],
    },
    {
      name: "DevDocs Search",
      description: "Semantic documentation search with embeddings and hybrid ranking.",
      stack: ["Python", "React", "Docker"],
    },
  ],
};

const skillSeed: [string, string, number][] = [
  ["React", "Frontend", 88],
  ["TypeScript", "Languages", 84],
  ["JavaScript", "Languages", 90],
  ["Node.js", "Backend", 80],
  ["Express.js", "Backend", 76],
  ["HTML", "Frontend", 92],
  ["CSS", "Frontend", 85],
  ["Tailwind CSS", "Frontend", 82],
  ["REST APIs", "Backend", 81],
  ["GraphQL", "Backend", 55],
  ["Neo4j", "Databases", 48],
  ["openCypher", "Databases", 44],
  ["PostgreSQL", "Databases", 68],
  ["MongoDB", "Databases", 62],
  ["Redis", "Databases", 40],
  ["Docker", "DevOps", 52],
  ["Kubernetes", "DevOps", 24],
  ["AWS", "Cloud", 46],
  ["CI/CD", "DevOps", 50],
  ["Git", "Tools", 89],
  ["Jest", "Testing", 58],
  ["Playwright", "Testing", 35],
  ["Next.js", "Frontend", 66],
  ["Vite", "Tools", 72],
  ["Redux", "Frontend", 61],
  ["React Flow", "Frontend", 45],
  ["Python", "Languages", 57],
  ["Django", "Backend", 30],
  ["Go", "Languages", 20],
  ["Java", "Languages", 35],
  ["Spring Boot", "Backend", 22],
  ["System Design", "Architecture", 54],
  ["Microservices", "Architecture", 42],
  ["Data Modeling", "Architecture", 60],
  ["Graph Algorithms", "Architecture", 38],
  ["Machine Learning", "AI", 28],
  ["LLM Integration", "AI", 44],
  ["Figma", "Design", 55],
  ["Accessibility", "Design", 63],
  ["Agile", "Process", 70],
];

export const skills: Skill[] = skillSeed.map(([name, category, proficiency], i) => ({
  id: `s${i + 1}`,
  name,
  category,
  proficiency,
}));

const skillId = (name: string) => skills.find((s) => s.name === name)!.id;

export const companies: Company[] = [
  { id: "c1", name: "Northwind Labs", industry: "Developer Tools", location: "Bengaluru, India", size: "180 employees", about: "Builds observability tooling used by 4,000+ engineering teams." },
  { id: "c2", name: "Lumen Analytics", industry: "Data & Analytics", location: "Hyderabad, India", size: "540 employees", about: "Real-time analytics infrastructure for retail and fintech." },
  { id: "c3", name: "Aster Health", industry: "Health Tech", location: "Chennai, India", size: "320 employees", about: "Patient-graph platform connecting care providers and records." },
  { id: "c4", name: "Vertex Cloud", industry: "Cloud Infrastructure", location: "Pune, India", size: "1,200 employees", about: "Managed cloud primitives for regulated industries." },
  { id: "c5", name: "Orbit Commerce", industry: "E-Commerce", location: "Remote, India", size: "260 employees", about: "Headless commerce APIs powering D2C brands." },
  { id: "c6", name: "Cognify AI", industry: "Artificial Intelligence", location: "Bengaluru, India", size: "95 employees", about: "Applied LLM products for knowledge-heavy workflows." },
  { id: "c7", name: "Harbor Fintech", industry: "Financial Services", location: "Mumbai, India", size: "780 employees", about: "Payments and lending rails for emerging markets." },
  { id: "c8", name: "Kite Mobility", industry: "Logistics", location: "Delhi NCR, India", size: "410 employees", about: "Route optimization and fleet intelligence at scale." },
  { id: "c9", name: "Solace Media", industry: "Media & Streaming", location: "Remote, Global", size: "150 employees", about: "Personalized streaming experiences for regional audiences." },
  { id: "c10", name: "Quanta Robotics", industry: "Robotics", location: "Coimbatore, India", size: "210 employees", about: "Warehouse automation with vision-guided robotics." },
];

const jobSeed: [string, string, string, string, number, string, string[], string][] = [
  ["Senior Frontend Engineer", "c1", "Bengaluru, India", "3-5 years", 2800000, "Own the component system and graph visualisation surface of our observability product.", ["React", "TypeScript", "Tailwind CSS", "Accessibility", "Vite"], "2 days ago"],
  ["Full Stack Developer", "c1", "Remote, India", "2-4 years", 2400000, "Ship end-to-end features across a React frontend and a Node.js graph API.", ["React", "Node.js", "TypeScript", "REST APIs", "PostgreSQL"], "4 days ago"],
  ["Graph Platform Engineer", "c2", "Hyderabad, India", "3-6 years", 3200000, "Model and query billion-edge graphs powering real-time recommendations.", ["Neo4j", "openCypher", "Graph Algorithms", "Data Modeling", "Node.js"], "1 day ago"],
  ["Backend Engineer (Node.js)", "c2", "Hyderabad, India", "2-5 years", 2600000, "Design resilient APIs and event pipelines for analytics ingestion.", ["Node.js", "Express.js", "REST APIs", "Redis", "Docker"], "6 days ago"],
  ["React Engineer", "c3", "Chennai, India", "1-3 years", 1800000, "Build clinician-facing interfaces with a strong accessibility bar.", ["React", "JavaScript", "CSS", "Accessibility", "Jest"], "3 days ago"],
  ["Product Engineer", "c3", "Chennai, India", "2-4 years", 2200000, "Work close to users, from discovery to production rollout.", ["React", "Node.js", "MongoDB", "Figma", "Agile"], "1 week ago"],
  ["Platform Engineer", "c4", "Pune, India", "4-7 years", 3600000, "Run the internal developer platform and deployment tooling.", ["Kubernetes", "Docker", "AWS", "CI/CD", "Go"], "5 days ago"],
  ["Cloud Solutions Engineer", "c4", "Pune, India", "3-5 years", 3000000, "Partner with customers to architect cloud migrations.", ["AWS", "Docker", "System Design", "Python", "Microservices"], "2 weeks ago"],
  ["Frontend Developer", "c5", "Remote, India", "1-3 years", 1600000, "Build storefront experiences that convert on every device.", ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"], "1 day ago"],
  ["Senior Full Stack Engineer", "c5", "Remote, India", "5-8 years", 4000000, "Lead the headless commerce API and its React admin surface.", ["React", "Node.js", "TypeScript", "GraphQL", "System Design"], "3 days ago"],
  ["AI Application Engineer", "c6", "Bengaluru, India", "2-5 years", 3100000, "Ship LLM-backed product surfaces with strong evaluation loops.", ["LLM Integration", "Python", "React", "TypeScript", "REST APIs"], "2 days ago"],
  ["Knowledge Graph Engineer", "c6", "Bengaluru, India", "3-6 years", 3400000, "Turn unstructured corpora into queryable knowledge graphs.", ["Neo4j", "openCypher", "Python", "Graph Algorithms", "Data Modeling"], "4 days ago"],
  ["Payments Backend Engineer", "c7", "Mumbai, India", "3-6 years", 3300000, "Build ledgering and reconciliation services with strict guarantees.", ["Java", "Spring Boot", "PostgreSQL", "System Design", "Microservices"], "1 week ago"],
  ["Fullstack Engineer (Fintech)", "c7", "Mumbai, India", "2-4 years", 2500000, "Deliver merchant dashboards backed by Node.js services.", ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"], "5 days ago"],
  ["Frontend Platform Engineer", "c8", "Delhi NCR, India", "4-6 years", 3200000, "Own shared UI infrastructure across five product teams.", ["React", "TypeScript", "Vite", "Jest", "Accessibility"], "3 days ago"],
  ["Data Engineer", "c8", "Delhi NCR, India", "2-5 years", 2700000, "Model routing data and build batch + streaming pipelines.", ["Python", "PostgreSQL", "Docker", "Data Modeling", "AWS"], "1 week ago"],
  ["Web Engineer", "c9", "Remote, Global", "2-4 years", 2300000, "Optimise streaming playback surfaces for low-bandwidth networks.", ["JavaScript", "React", "Next.js", "CSS", "Playwright"], "2 days ago"],
  ["Senior React Developer", "c9", "Remote, Global", "4-7 years", 3500000, "Architect the next generation of our viewing experience.", ["React", "TypeScript", "Redux", "Next.js", "Jest"], "6 days ago"],
  ["Robotics Software Engineer", "c10", "Coimbatore, India", "3-5 years", 2900000, "Write control-plane software for autonomous warehouse fleets.", ["Python", "Go", "Docker", "System Design", "Machine Learning"], "2 weeks ago"],
  ["Full Stack Developer (Robotics)", "c10", "Coimbatore, India", "2-4 years", 2400000, "Build operator consoles and telemetry APIs.", ["React", "Node.js", "TypeScript", "Redis", "Docker"], "4 days ago"],
  ["Junior Frontend Engineer", "c1", "Bengaluru, India", "0-2 years", 1200000, "Grow into the frontend craft alongside senior mentors.", ["HTML", "CSS", "JavaScript", "React", "Git"], "1 day ago"],
  ["API Engineer", "c2", "Remote, India", "2-4 years", 2500000, "Design and document public-facing analytics APIs.", ["Node.js", "Express.js", "REST APIs", "GraphQL", "Git"], "1 week ago"],
  ["Design Engineer", "c5", "Bengaluru, India", "2-5 years", 2600000, "Bridge design and engineering on a shared component library.", ["Figma", "React", "Tailwind CSS", "CSS", "Accessibility"], "3 days ago"],
  ["Site Reliability Engineer", "c4", "Remote, India", "3-6 years", 3300000, "Keep a multi-region platform fast and boringly reliable.", ["Kubernetes", "AWS", "CI/CD", "Docker", "Go"], "5 days ago"],
  ["Graph Data Analyst", "c6", "Bengaluru, India", "1-3 years", 1900000, "Answer product questions with Cypher traversals and dashboards.", ["openCypher", "Neo4j", "Python", "Data Modeling", "Graph Algorithms"], "2 days ago"],
];

export const jobs: Job[] = jobSeed.map(([title, companyId, location, experience, salaryMin, description, skillNames, posted], i) => ({
  id: `j${i + 1}`,
  title,
  companyId,
  location,
  experience,
  salaryMin,
  salary: `₹${(salaryMin / 100000).toFixed(0)}–${((salaryMin * 1.35) / 100000).toFixed(0)} LPA`,
  description,
  skillIds: skillNames.map(skillId),
  posted,
}));

// (User)-[:HAS_SKILL]->(Skill) — the current user's skill set
export const userSkillIds = [
  "React", "TypeScript", "JavaScript", "Node.js", "Express.js", "HTML", "CSS",
  "Tailwind CSS", "REST APIs", "PostgreSQL", "MongoDB", "Git", "Vite", "Redux",
  "Jest", "Docker", "Agile", "Accessibility", "Data Modeling", "Figma",
].map(skillId);

export const appliedJobIds = ["j2", "j10"];
export const interestedJobIds = ["j3", "j12", "j15"];

// (Skill)-[:RELATED_TO]->(Skill)
const relatedSeed: [string, string][] = [
  ["React", "Next.js"], ["React", "Redux"], ["React", "React Flow"],
  ["JavaScript", "TypeScript"], ["Node.js", "Express.js"], ["Node.js", "GraphQL"],
  ["Neo4j", "openCypher"], ["Neo4j", "Graph Algorithms"], ["openCypher", "Data Modeling"],
  ["Docker", "Kubernetes"], ["Docker", "CI/CD"], ["AWS", "Kubernetes"],
  ["PostgreSQL", "Data Modeling"], ["MongoDB", "Data Modeling"], ["Redis", "System Design"],
  ["Jest", "Playwright"], ["CSS", "Tailwind CSS"], ["HTML", "Accessibility"],
  ["Python", "Machine Learning"], ["Machine Learning", "LLM Integration"],
  ["System Design", "Microservices"], ["Java", "Spring Boot"], ["Python", "Django"],
  ["Figma", "Accessibility"], ["TypeScript", "GraphQL"], ["Go", "Microservices"],
];
export const relatedSkills = relatedSeed.map(([a, b]) => ({ from: skillId(a), to: skillId(b) }));

/* ---------- derived helpers (mirror the backend Cypher queries) ---------- */

export const getSkill = (id: string) => skills.find((s) => s.id === id);
export const getJob = (id: string) => jobs.find((j) => j.id === id);
export const getCompany = (id: string) => companies.find((c) => c.id === id);
export const skillsByName = (ids: string[]) => ids.map((i) => getSkill(i)!).filter(Boolean);

export const userSkills = () => skillsByName(userSkillIds);

export interface JobMatch {
  job: Job;
  company: Company;
  matching: Skill[];
  missing: Skill[];
  match: number;
}

export function matchForJob(job: Job): JobMatch {
  const matching = job.skillIds.filter((s) => userSkillIds.includes(s)).map((s) => getSkill(s)!);
  const missing = job.skillIds.filter((s) => !userSkillIds.includes(s)).map((s) => getSkill(s)!);
  const base = (matching.length / job.skillIds.length) * 100;
  const prof = matching.length
    ? matching.reduce((a, s) => a + s.proficiency, 0) / matching.length
    : 0;
  return {
    job,
    company: getCompany(job.companyId)!,
    matching,
    missing,
    match: Math.min(99, Math.round(base * 0.75 + prof * 0.25)),
  };
}

export const allMatches = (): JobMatch[] =>
  jobs.map(matchForJob).sort((a, b) => b.match - a.match);

export const recommendedJobs = (n = 6) => allMatches().slice(0, n);

export const jobsForCompany = (companyId: string) => jobs.filter((j) => j.companyId === companyId);

export const jobsForSkill = (id: string) => jobs.filter((j) => j.skillIds.includes(id));

export const relatedTo = (id: string) =>
  relatedSkills
    .filter((r) => r.from === id || r.to === id)
    .map((r) => getSkill(r.from === id ? r.to : r.from)!)
    .filter(Boolean);

/** Skills the user lacks, ranked by how many jobs demand them. */
export function recommendedSkills(n = 6) {
  return skills
    .filter((s) => !userSkillIds.includes(s.id))
    .map((s) => ({ skill: s, demand: jobsForSkill(s.id).length }))
    .filter((r) => r.demand > 0)
    .sort((a, b) => b.demand - a.demand)
    .slice(0, n);
}

/** Owned skills below the bar required by high-match jobs. */
export function skillsToImprove(n = 5) {
  return userSkills()
    .filter((s) => s.proficiency < 75)
    .map((s) => ({ skill: s, required: Math.min(95, s.proficiency + 15 + (jobsForSkill(s.id).length % 4) * 3), jobs: jobsForSkill(s.id) }))
    .sort((a, b) => b.jobs.length - a.jobs.length)
    .slice(0, n);
}

export function recommendedCompanies(n = 4) {
  const scored = companies.map((c) => {
    const ms = jobsForCompany(c.id).map(matchForJob);
    const best = ms.length ? Math.max(...ms.map((m) => m.match)) : 0;
    const avg = ms.length ? Math.round(ms.reduce((a, m) => a + m.match, 0) / ms.length) : 0;
    return { company: c, jobs: ms.length, best, match: Math.round(best * 0.6 + avg * 0.4) };
  });
  return scored.sort((a, b) => b.match - a.match).slice(0, n);
}

export function popularSkillsForCompany(companyId: string, n = 5) {
  const counts = new Map<string, number>();
  jobsForCompany(companyId).forEach((j) =>
    j.skillIds.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)),
  );
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id]) => getSkill(id)!);
}

export const locations = [...new Set(jobs.map((j) => j.location))].sort();
export const experienceLevels = [...new Set(jobs.map((j) => j.experience))].sort();
export const skillCategories = [...new Set(skills.map((s) => s.category))].sort();
