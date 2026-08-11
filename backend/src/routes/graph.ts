import { Router } from "express";
import { runQuery } from "../db/cognodb";

const router = Router();

router.get("/:userId", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH path =
        (u:User {id: $userId})
        -[:HAS_SKILL]->
        (s:Skill)
        -[:REQUIRED_FOR]->
        (j:Job)
        -[:AT_COMPANY]->
        (c:Company)

      RETURN path
      LIMIT 100
      `,
      {
        userId: req.params.userId
      }
    );

    const nodes = new Map<string, any>();
    const relationships: any[] = [];

    for (const record of records) {
      const path = record.get("path");

      for (const node of path.nodes) {
        const id = String(node.properties.id);

        if (!nodes.has(id)) {
          nodes.set(id, {
            id,
            labels: node.labels,
            properties: node.properties
          });
        }
      }

      for (const relationship of path.relationships) {
        relationships.push({
          id: String(relationship.elementId),
          type: relationship.type,
          start: String(
            relationship.startNodeElementId
          ),
          end: String(
            relationship.endNodeElementId
          ),
          properties: relationship.properties
        });
      }
    }

    res.json({
      success: true,
      data: {
        nodes: Array.from(nodes.values()),
        relationships
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/path/:userId/:jobId", async (req, res, next) => {
  try {
    const records = await runQuery(
      `
      MATCH path =
        (u:User {id: $userId})
        -[:HAS_SKILL]->
        (s:Skill)
        -[:REQUIRED_FOR]->
        (j:Job {id: $jobId})

      RETURN path
      LIMIT 20
      `,
      {
        userId: req.params.userId,
        jobId: req.params.jobId
      }
    );

    res.json({
      success: true,
      data: records.map(
        (record) => record.get("path")
      )
    });
  } catch (error) {
    next(error);
  }
});

export default router;
