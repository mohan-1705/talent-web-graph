import neo4j, {
  Driver,
  Session,
  Record as Neo4jRecord
} from "neo4j-driver";

import { env } from "../config/env";

export const driver: Driver = neo4j.driver(
  env.cognodbUri,
  neo4j.auth.basic(
    env.cognodbUsername,
    env.cognodbPassword
  )
);

export async function verifyDatabaseConnection(): Promise<void> {
  await driver.verifyConnectivity();
  console.log("✅ CognoDB connection successful");
}

export async function closeDatabase(): Promise<void> {
  await driver.close();
}

export async function runQuery(
  query: string,
  params: Record<string, unknown> = {}
): Promise<Neo4jRecord[]> {
  const session: Session = driver.session();

  try {
    const result = await session.run(query, params);
    return result.records;
  } finally {
    await session.close();
  }
}
