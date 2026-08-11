import { Router } from "express";
import { runQuery } from "../db/cognodb";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const records = await runQuery(`
      MATCH (s:Skill)
      RETURN s
      ORDER BY s.name
    `);

    res.json({
      success: true,
      data: records.map(
        (record) => record.get("s").properties
      )
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH (s:Skill {id: $id})
      RETURN s
      LIMIT 1
      `,
      {
        id: req.params.id
      }
    );

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Skill not found"
      });
    }

    res.json({
      success: true,
      data: records[0].get("s").properties
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/jobs", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH (s:Skill {id: $id})-[:REQUIRED_FOR]->(j:Job)
      RETURN j
      ORDER BY j.title
      `,
      {
        id: req.params.id
      }
    );

    res.json({
      success: true,
      data: records.map(
        (record) => record.get("j").properties
      )
    });
  } catch (error) {
    next(error);
  }
});

export default router;
