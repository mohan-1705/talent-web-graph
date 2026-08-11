import { Router } from "express";
import { runQuery } from "../db/cognodb";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const records = await runQuery(`
      MATCH (c:Company)
      OPTIONAL MATCH (j:Job)-[:AT_COMPANY]->(c)
      RETURN
        c,
        count(DISTINCT j) AS jobCount
      ORDER BY c.name
    `);

    const companies = records.map((record) => ({
      ...record.get("c").properties,
      jobCount: Number(record.get("jobCount"))
    }));

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH (c:Company {id: $id})
      OPTIONAL MATCH (j:Job)-[:AT_COMPANY]->(c)
      OPTIONAL MATCH (s:Skill)-[:REQUIRED_FOR]->(j)
      RETURN
        c,
        collect(DISTINCT j) AS jobs,
        collect(DISTINCT s) AS skills
      LIMIT 1
      `,
      {
        id: req.params.id
      }
    );

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Company not found"
      });
    }

    const record = records[0];

    res.json({
      success: true,
      data: {
        ...record.get("c").properties,
        jobs: record.get("jobs").map(
          (job: any) => job.properties
        ),
        skills: record.get("skills").map(
          (skill: any) => skill.properties
        )
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
