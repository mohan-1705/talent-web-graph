import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT || 10000),

  cognodbUri: required("COGNODB_URI"),
  cognodbUsername: required("COGNODB_USERNAME"),
  cognodbPassword: required("COGNODB_PASSWORD"),

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
};
