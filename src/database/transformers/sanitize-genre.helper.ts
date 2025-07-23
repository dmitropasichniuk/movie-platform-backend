import { GenreFromApiDto, GenreResponseDto } from "@genre";

export function sanitizeGenreData(
  raw: GenreFromApiDto,
): Partial<GenreResponseDto> {
  return {
    externalId: raw.id,
    name: raw.name,
  };
}
