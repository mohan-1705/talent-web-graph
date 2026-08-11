import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error(
    "COGNODB_URI, COGNODB_USERNAME and COGNODB_PASSWORD are required"
  );
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

const users = [
  {
    id: "user-001",
    name: "Mohana Rangaji",
    email: "mohana@example.com",
    education: "B.Tech Computer Science Engineering",
    experience: "Software Engineering Intern"
  },
  {
    id: "user-002",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    education: "B.Tech Computer Science",
    experience: "Junior Developer"
  },
  {
    id: "user-003",
    name: "Ananya Reddy",
    email: "ananya@example.com",
    education: "B.Tech Information Technology",
    experience: "Frontend Developer"
  }
];

const skills = [
  {
    id: "skill-001",
    name: "React",
    category: "Frontend",
    proficiency: "Advanced"
  },
  {
    id: "skill-002",
    name: "JavaScript",
    category: "Programming",
    proficiency: "Advanced"
  },
  {
    id: "skill-003",
    name: "TypeScript",
    category: "Programming",
    proficiency: "Intermediate"
  },
  {
    id: "skill-004",
    name: "Node.js",
    category: "Backend",
    proficiency: "Intermediate"
  },
  {
    id: "skill-005",
    name: "Express.js",
    category: "Backend",
    proficiency: "Intermediate"
  },
  {
    id: "skill-006",
    name: "Python",
    category: "Programming",
    proficiency: "Advanced"
  },
  {
    id: "skill-007",
    name: "SQL",
    category: "Database",
    proficiency: "Intermediate"
  },
  {
    id: "skill-008",
    name: "MongoDB",
    category: "Database",
    proficiency: "Intermediate"
  },
  {
    id: "skill-009",
    name: "Git",
    category: "Tools",
    proficiency: "Advanced"
  },
  {
    id: "skill-010",
    name: "AWS",
    category: "Cloud",
    proficiency: "Intermediate"
  },
  {
    id: "skill-011",
    name: "Graph Databases",
    category: "Database",
    proficiency: "Intermediate"
  },
  {
    id: "skill-012",
    name: "Cypher",
    category: "Database",
    proficiency: "Intermediate"
  }
];

const companies = [
  {
    id: "company-001",
    name: "TechNova",
    industry: "Software",
    location: "Bengaluru, India"
  },
  {
    id: "company-002",
    name: "DataSphere",
    industry: "AI & Data",
    location: "Hyderabad, India"
  },
  {
    id: "company-003",
    name: "CloudWorks",
    industry: "Cloud Computing",
    location: "Pune, India"
  },
  {
    id: "company-004",
    name: "InnovateLabs",
    industry: "Technology",
    location: "Bengaluru, India"
  }
];

const jobs = [
  {
    id: "job-001",
    title: "Full Stack Developer",
    location: "Bengaluru, India",
    experience: "0-2 years",
    salary: "6-10 LPA",
    description:
      "Build scalable web applications using React and Node.js."
  },
  {
    id: "job-002",
    title: "Frontend Developer",
    location: "Hyderabad, India",
    experience: "0-2 years",
    salary: "5-9 LPA",
    description:
      "Develop modern interfaces using React and TypeScript."
  },
  {
    id: "job-003",
    title: "Backend Developer",
    location: "Pune, India",
    experience: "1-3 years",
    salary: "7-12 LPA",
    description:
      "Develop APIs and backend services using Node.js."
  },
  {
    id: "job-004",
    title: "AI Application Developer",
    location: "Bengaluru, India",
    experience: "0-2 years",
    salary: "7-13 LPA",
    description:
      "Build AI-powered applications using Python and modern web technologies."
  },
  {
    id: "job-005",
    title: "Graph Data Engineer",
    location: "Hyderabad, India",
    experience: "0-3 years",
    salary: "8-14 LPA",
    description:
      "Build graph-based data applications using Cypher and graph databases."
  }
];

const userSkillMap: Record<string, string[]> = {
  "user-001": [
    "skill-001",
    "skill-002",
    "skill-003",
    "skill-004",
    "skill-006",
    "skill-007",
    "skill-009",
    "skill-011",
    "skill-012"
  ],
  "user-002": [
    "skill-002",
    "skill-004",
    "skill-005",
    "skill-007",
    "skill-009"
  ],
  "user-003": [
    "skill-001",
    "skill-002",
    "skill-003",
    "skill-009"
  ]
};

const jobSkillMap: Record<string, string[]> = {
  "job-001": [
    "skill-001",
    "skill-002",
    "skill-004",
    "skill-009"
  ],
  "job-002": [
    "skill-001",
    "skill-002",
    "skill-003"
  ],
  "job-003": [
    "skill-004",
    "skill-005",
    "skill-007"
  ],
  "job-004": [
    "skill-006",
    "skill-001",
    "skill-004"
  ],
  "job-005": [
    "skill-011",
    "skill-012",
    "skill-007"
  ]
};

const jobCompanyMap: Record<string, string> = {
  "job-001": "company-001",
  "job-002": "company-002",
  "job-003": "company-003",
  "job-004": "company-001",
  "job-005": "company-002"
};

async function seed() {
  const session = driver.session();

  try {
    console.log("Clearing existing graph...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Creating users...");

    for (const user of users) {
      await session.run(
        `
        CREATE (u:User {
          id: $id,
          name: $name,
          email: $email,
          education: $education,
          experience: $experience
        })
        `,
        user
      );
    }

    console.log("Creating skills...");

    for (const skill of skills) {
      await session.run(
        `
        CREATE (s:Skill {
          id: $id,
          name: $name,
          category: $category,
          proficiency: $proficiency
        })
        `,
        skill
      );
    }

    console.log("Creating companies...");

    for (const company of companies) {
      await session.run(
        `
        CREATE (c:Company {
          id: $id,
          name: $name,
          industry: $industry,
          location: $location
        })
        `,
        company
      );
    }

    console.log("Creating jobs...");

    for (const job of jobs) {
      await session.run(
        `
        CREATE (j:Job {
          id: $id,
          title: $title,
          location: $location,
          experience: $experience,
          salary: $salary,
          description: $description
        })
        `,
        job
      );
    }

    console.log("Creating user → skill relationships...");

    for (const [userId, skillIds] of Object.entries(
      userSkillMap
    )) {
      for (const skillId of skillIds) {
        await session.run(
          `
          MATCH (u:User {id: $userId})
          MATCH (s:Skill {id: $skillId})
          CREATE (u)-[:HAS_SKILL]->(s)
          `,
          {
            userId,
            skillId
          }
        );
      }
    }

    console.log("Creating skill → job relationships...");

    for (const [jobId, skillIds] of Object.entries(
      jobSkillMap
    )) {
      for (const skillId of skillIds) {
        await session.run(
          `
          MATCH (s:Skill {id: $skillId})
          MATCH (j:Job {id: $jobId})
          CREATE (s)-[:REQUIRED_FOR]->(j)
          `,
          {
            skillId,
            jobId
          }
        );
      }
    }

    console.log("Creating job → company relationships...");

    for (const [jobId, companyId] of Object.entries(
      jobCompanyMap
    )) {
      await session.run(
        `
        MATCH (j:Job {id: $jobId})
        MATCH (c:Company {id: $companyId})
        CREATE (j)-[:AT_COMPANY]->(c)
        `,
        {
          jobId,
          companyId
        }
      );
    }

    console.log("Creating related skill relationships...");

    const relatedSkills = [
      ["skill-001", "skill-003"],
      ["skill-002", "skill-003"],
      ["skill-004", "skill-005"],
      ["skill-011", "skill-012"],
      ["skill-006", "skill-007"]
    ];

    for (const [a, b] of relatedSkills) {
      await session.run(
        `
        MATCH (a:Skill {id: $a})
        MATCH (b:Skill {id: $b})
        CREATE (a)-[:RELATED_TO]->(b)
        `,
        {
          a,
          b
        }
      );
    }

    console.log("✅ Seed completed successfully");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
