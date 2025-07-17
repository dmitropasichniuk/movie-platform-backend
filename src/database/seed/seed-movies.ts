import { DataSource, In } from "typeorm";

import { GenreEntity } from "@genre";
import { MovieEntity } from "@movies";
import { movies, sanitizeMovieData } from "@db-seed";
import { LoggerService } from "@utils";

export const seedMovies = async (dataSource: DataSource) => {
  const movieRepo = dataSource.getRepository(MovieEntity);
  const genreRepo = dataSource.getRepository(GenreEntity);

  for (const movie of movies) {
    try {
      const movieSanitized = sanitizeMovieData(movie);

      const genres = await genreRepo.findBy({
        externalId: In(movieSanitized.genreIds),
      });

      const exists = await movieRepo.findOneBy({
        externalId: movieSanitized.externalId,
      });

      if (!exists) {
        await movieRepo.save({ ...movieSanitized, genres });
        LoggerService.log(
          "SeedMovies",
          `Inserted movie: ${movieSanitized.title}`
        );
      } else {
        LoggerService.log(
          "SeedMovies",
          `Skipped existing movie: ${movieSanitized.title}`
        );
      }
    } catch (err) {
      LoggerService.warn("SeedMovies", `Skipped invalid movie: ${err.message}`);
    }
  }
};
