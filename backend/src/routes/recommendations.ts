import { Router } from "express";
import { runQuery } from "../db/cognodb";

const router = Router();

router.get("/:userId", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)
      MATCH (s)-[:REQUIRED_FOR]->(j:Job)
      OPTIONAL MATCH (j)-[:AT_COMPANY]->(c:Company)

      WITH
        u,
        j,
        c,
        count(DISTINCT s) AS matchingSkills

      MATCH (j)<-[:REQUIRED_FOR]-(required:Skill)

      WITH
        j,
        c,
        matchingSkills,
        count(DISTINCT required) AS totalRequired

      RETURN
        j,
        c,
        matchingSkills,
        totalRequired,
        CASE
          WHEN totalRequired = 0 THEN 0
          ELSE round(
            (toFloat(matchingSkills) /
            toFloat(totalRequired)) * 100
          )
        END AS matchPercentage

      ORDER BY matchPercentage DESC
      LIMIT 10
      `,
      {
        userId: req.params.userId
      }
    );

    const recommendations = records.map((record) => ({
      job: record.get("j").properties,
      company: record.get("c")
        ? record.get("c").properties
        : null,
      matchingSkills: Number(
        record.get("matchingSkills")
      ),
      totalRequired: Number(
        record.get("totalRequired")
      ),
      matchPercentage: Number(
        record.get("matchPercentage")
      )
    }));

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
});

export default router;
