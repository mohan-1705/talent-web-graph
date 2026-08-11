# SkillGraph — AI Skill & Job Recommendation Platform

Graph-based career intelligence: SkillGraph maps **Users → Skills → Jobs → Companies** and turns
graph traversals into explainable job, skill and company recommendations.

## Features

- Login, dashboard, job explorer, job details, skills, graph explorer, recommendations, companies, profile, settings
- Interactive graph canvas with node search, zoom, reset, type filters, relationship toggles and a details panel
- Explainable matching: matching skills, missing skills, match percentage and the exact graph path
- Loading / empty / error / database-unavailable states on every data-driven page
- Responsive, accessible, light-theme SaaS design system built on semantic tokens

## Technology stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, TanStack Router + Query, Tailwind CSS v4, React Flow (`@xyflow/react`), Lucide React |
| Backend | Node.js, Express.js, TypeScript, official Neo4j JavaScript driver |
| Database | CognoDB Cloud, openCypher, Bolt 5.x |
| Tooling | Git, GitHub, npm/bun, ESLint, Prettier, Postman |
| Deployment | Frontend on Vercel, backend on Render, database on CognoDB Cloud |

## Architecture

```text
React + TypeScript frontend
        ↓ REST (fetch)
Node.js + Express backend
        ↓ official Neo4j driver (Bolt 5.x)
CognoDB Cloud
        ↓
Graph data
```

The frontend never connects to CognoDB. The backend owns connections, parameterized Cypher,
validation, error handling and business logic.

## Graph data model

Nodes: `User(id, name, email, education, experience)`, `Skill(id, name, category, proficiency)`,
`Job(id, title, location, experience, salary, description)`, `Company(id, name, industry, location)`.

Relationships:

```text
(User)-[:HAS_SKILL]->(Skill)
(Skill)-[:REQUIRED_FOR]->(Job)
(Job)-[:AT_COMPANY]->(Company)
(User)-[:APPLIED_TO]->(Job)
(User)-[:INTERESTED_IN]->(Job)
(Skill)-[:RELATED_TO]->(Skill)
```

## Why a graph database?

Recommendations here are *path* questions, not row questions: "which jobs are two hops from my
skills", "what is missing between me and this role", "which related skill unlocks the most
companies". In SQL each hop is another join, and variable-depth traversal needs recursive CTEs that
degrade fast. In openCypher a multi-hop match is one readable query with near-constant cost per hop,
and the same traversal that produces the recommendation is also what the UI renders as the
explanation.

## Environment variables

See `.env.example`: `COGNODB_URI`, `COGNODB_USERNAME`, `COGNODB_PASSWORD`, `PORT`, `FRONTEND_URL`.
`.env` is never committed; credentials live only in environment variables (Render/Vercel dashboards).

## Installation and running locally

```bash
npm install
npm run dev          # frontend
# backend/
npm install && npm run seed && npm run dev
```

With `VITE_API_URL` unset the frontend resolves against local seed data so the UI is fully demoable.

## Seed data

20 users, 40 skills, 25 jobs, 10 companies plus their relationships (`backend/scripts/seed.ts`).

## API documentation

```text
GET    /api/users/:id                GET /api/users/:id/skills
GET    /api/jobs                     GET /api/jobs/:id       GET /api/jobs/:id/matches
GET    /api/skills                   GET /api/skills/:id
GET    /api/companies                GET /api/companies/:id
GET    /api/recommendations/:userId  GET /api/graph/:userId
POST   /api/skills   PUT /api/skills/:id   DELETE /api/skills/:id
```

## Main Cypher queries

```cypher
// Jobs requiring a user's skills, with match score
MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)-[:REQUIRED_FOR]->(j:Job)-[:AT_COMPANY]->(c:Company)
WITH j, c, count(DISTINCT s) AS matched
MATCH (req:Skill)-[:REQUIRED_FOR]->(j)
WITH j, c, matched, count(DISTINCT req) AS required
RETURN j, c, toInteger(100.0 * matched / required) AS match
ORDER BY match DESC LIMIT $limit;

// Missing skills for a job
MATCH (req:Skill)-[:REQUIRED_FOR]->(j:Job {id: $jobId})
WHERE NOT EXISTS { MATCH (:User {id: $userId})-[:HAS_SKILL]->(req) }
RETURN req;

// Related-skill expansion
MATCH (:User {id: $userId})-[:HAS_SKILL]->(:Skill)-[:RELATED_TO]-(r:Skill)-[:REQUIRED_FOR]->(j:Job)
RETURN DISTINCT r, count(j) AS demand ORDER BY demand DESC;
```

All queries are parameterized — user input is never concatenated into Cypher.

## Future improvements

Real authentication + per-user graphs, embedding-based skill similarity, saved searches and alerts,
graph algorithms (PageRank, community detection) for company clustering, and recruiter-side views.
