import express from "express";
import cors from "cors";

import { env } from "./config/env";
import {
  verifyDatabaseConnection,
  closeDatabase
} from "./db/cognodb";

import healthRouter from "./routes/health";
import usersRouter from "./routes/users";
import skillsRouter from "./routes/skills";
import jobsRouter from "./routes/jobs";
import companiesRouter from "./routes/companies";
import recommendationsRouter from "./routes/recommendations";
import graphRouter from "./routes/graph";

import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "SkillGraph API is running"
  });
});

app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/graph", graphRouter);

app.use(errorHandler);

const startServer = async () => {
  try {
    await verifyDatabaseConnection();

    app.listen(env.port, "0.0.0.0", () => {
      console.log(
        `🚀 SkillGraph API running on port ${env.port}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to connect to CognoDB:",
      error
    );

    process.exit(1);
  }
};

const shutdown = async () => {
  console.log("Shutting down...");

  await closeDatabase();

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
