import { MovieFromApiDto, MovieSanitizeDto } from "@movies";

export function sanitizeMovieData(
  raw: MovieFromApiDto,
): Partial<MovieSanitizeDto> {
  return {
    externalId: raw.id,
    title: raw.title,
    description: raw.overview,
    releaseDate: raw.release_date,
    originalLanguage: raw.original_language,
    adult: raw.adult ?? false,
    genreIds: raw.genre_ids ?? [],
    popularity: raw.popularity,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    videoId: null,
  };
}
