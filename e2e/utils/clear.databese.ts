import { DataSource } from "typeorm";

export async function clearDatabase(db: DataSource) {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("clearDatabase() should only be used in test environment!");
  }

  const tables = await db.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
`);
  try {
    await db.query(`
    TRUNCATE TABLE
      "users_favourite_movies_movies",
      "movies_genres_genres",
      "genres",
      "movies",
      "users"
    RESTART IDENTITY CASCADE
  `);
    console.log("TRUNCATE successful");
  } catch (e) {
    console.error("TRUNCATE failed:", e.message);
  }
}
