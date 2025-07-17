import { DataSource } from "typeorm";

import { GenreEntity } from "@genre";
import { MovieEntity } from "@movies";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [GenreEntity, MovieEntity],
  synchronize: true,
});
