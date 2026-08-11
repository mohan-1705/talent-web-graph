import { Router } from "express";
import { verifyDatabaseConnection } from "../db/cognodb";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await verifyDatabaseConnection();

    res.json({
      success: true,
      status: "ok",
      database: "connected",
      service: "SkillGraph API"
    });
  } catch (error) {
    console.error(error);

    res.status(503).json({
      success: false,
      status: "error",
      database: "disconnected",
      service: "SkillGraph API"
    });
  }
});

export default router;
