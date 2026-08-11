import { Router } from "express";
import { runQuery } from "../db/cognodb";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const records = await runQuery(`
      MATCH (u:User)
      RETURN u
      ORDER BY u.name
    `);

    const users = records.map((record) => {
      return record.get("u").properties;
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH (u:User {id: $id})
      RETURN u
      LIMIT 1
      `,
      {
        id: req.params.id
      }
    );

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    res.json({
      success: true,
      data: records[0].get("u").properties
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/skills", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH (u:User {id: $id})-[:HAS_SKILL]->(s:Skill)
      RETURN s
      ORDER BY s.name
      `,
      {
        id: req.params.id
      }
    );

    const skills = records.map(
      (record) => record.get("s").properties
    );

    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    next(error);
  }
});

export default router;
