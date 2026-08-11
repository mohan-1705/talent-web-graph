import { Router } from "express";
import { runQuery } from "../db/cognodb";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const records = await runQuery(
      `
      MATCH (j:Job)
      WHERE
        $search = ""
        OR toLower(j.title) CONTAINS toLower($search)
        OR toLower(j.description) CONTAINS toLower($search)
      OPTIONAL MATCH (j)-[:AT_COMPANY]->(c:Company)
      RETURN j, c
      ORDER BY j.title
      `,
      {
        search
      }
    );

    const jobs = records.map((record) => ({
      ...record.get("j").properties,
      company: record.get("c")
        ? record.get("c").properties
        : null
    }));

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH (j:Job {id: $id})
      OPTIONAL MATCH (j)-[:AT_COMPANY]->(c:Company)
      OPTIONAL MATCH (s:Skill)-[:REQUIRED_FOR]->(j)
      RETURN
        j,
        c,
        collect(s) AS skills
      LIMIT 1
      `,
      {
        id: req.params.id
      }
    );

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Job not found"
      });
    }

    const record = records[0];

    res.json({
      success: true,
      data: {
        ...record.get("j").properties,
        company: record.get("c")
          ? record.get("c").properties
          : null,
        skills: record.get("skills").map(
          (skill: any) => skill.properties
        )
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/matches", async (req, res, next) => {
  try {
    const userId =
      typeof req.query.userId === "string"
        ? req.query.userId
        : "";

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId query parameter is required"
      });
    }

    const records = await runQuery(
      `
      MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)
      MATCH (s)-[:REQUIRED_FOR]->(j:Job {id: $jobId})
      WITH u, j, collect(DISTINCT s) AS matchingSkills
      MATCH (j)<-[:REQUIRED_FOR]-(required:Skill)
      WITH
        u,
        j,
        matchingSkills,
        collect(DISTINCT required) AS requiredSkills
      RETURN
        j,
        size(matchingSkills) AS matchingCount,
        size(requiredSkills) AS requiredCount,
        [s IN matchingSkills | s.name] AS matchingSkills
      `,
      {
        userId,
        jobId: req.params.id
      }
    );

    if (records.length === 0) {
      return res.json({
        success: true,
        data: {
          matchingSkills: [],
          matchPercentage: 0
        }
      });
    }

    const record = records[0];

    const matchingCount = Number(
      record.get("matchingCount")
    );

    const requiredCount = Number(
      record.get("requiredCount")
    );

    const percentage =
      requiredCount === 0
        ? 0
        : Math.round(
            (matchingCount / requiredCount) * 100
          );

    res.json({
      success: true,
      data: {
        matchingSkills: record.get("matchingSkills"),
        matchPercentage: percentage
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
