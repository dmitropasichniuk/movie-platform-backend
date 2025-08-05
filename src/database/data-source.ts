import { DataSource } from "typeorm";

import { GenreEntity } from "../genre/entities/genres.entity";
import { MovieEntity } from "../movies/entities/movies.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [GenreEntity, MovieEntity],
  synchronize: true,
});
