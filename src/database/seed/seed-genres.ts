import { DataSource } from "typeorm";

import { genres, sanitizeGenreData } from "@db-seed";
import { GenreEntity } from "../../genre/entities/genres.entity";
import { LoggerService } from "@utils";

export const seedGenres = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(GenreEntity);
  for (const genre of genres) {
    try {
      const genreSanitized = sanitizeGenreData(genre);

      const exists = await repo.findOneBy({ id: genreSanitized.externalId });
      if (!exists) {
        await repo.save(genreSanitized);
        LoggerService.log("SeedGenres", `Inserted genre: ${genre.name}`);
      } else {
        LoggerService.log(
          "SeedGenres",
          `Skipped existing genre: ${genre.name}`
        );
      }
    } catch (error) {
      LoggerService.warn(
        "SeedGenres",
        `Skipped invalid genre: ${error.message}`
      );
    }
  }
};
