import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Trim } from "@decorators";
import { GenreResponseDto } from "@genre";

export class MovieResponseDto {
  // Main info
  @ApiProperty({
    description: "External movie ID (from TMDB)",
    example: 550,
  })
  @Expose()
  @IsInt({ message: "externalId must be an integer" })
  @Type(() => Number)
  externalId: number;

  @ApiProperty({
    description: "Movie title",
    example: "Fight Club",
  })
  @Expose()
  @IsString({ message: "title must be a string" })
  @Trim()
  @MinLength(2, { message: "title must be at least 2 characters long" })
  @MaxLength(50, { message: "title must not exceed 50 characters" })
  title: string;

  @ApiPropertyOptional({
    description: "Movie description",
    example: "An insomniac office worker crosses paths with a soap maker...",
  })
  @Expose()
  @IsOptional()
  @IsString({ message: "description must be a string" })
  description?: string;

  @ApiProperty({
    description: "Movie release date",
    example: "1999-10-15",
  })
  @Expose()
  @IsDateString({}, { message: "releaseDate must be a valid ISO date string" })
  releaseDate: string;

  // Secondary info
  @ApiProperty({
    description: "Original language",
    example: "en",
  })
  @Expose()
  @IsString({ message: "originalLanguage must be a string" })
  @Trim()
  @MinLength(2, {
    message: "originalLanguage must be at least 2 characters long",
  })
  @MaxLength(30, {
    message: "originalLanguage must not exceed 30 characters",
  })
  originalLanguage: string;

  @ApiProperty({
    description: "Whether the movie is for adults",
    example: false,
  })
  @Expose()
  @IsBoolean({ message: "adult must be a boolean value" })
  @Type(() => Boolean)
  adult: boolean;

  @ApiProperty({
    description: "List of genres",
    type: [GenreResponseDto],
  })
  @Expose()
  @Type(() => GenreResponseDto)
  genres: GenreResponseDto[];

  // Statistics
  @ApiProperty({
    description: "Movie popularity score",
    example: 123.45,
  })
  @Expose()
  @IsNumber({}, { message: "popularity must be a number" })
  @Type(() => Number)
  popularity: number;

  @ApiProperty({
    description: "Average user rating",
    example: 8.5,
  })
  @Expose()
  @IsNumber({}, { message: "voteAverage must be a number" })
  @Type(() => Number)
  voteAverage: number;

  @ApiProperty({
    description: "Number of votes",
    example: 24567,
  })
  @Expose()
  @IsInt({ message: "voteCount must be an integer" })
  voteCount: number;

  @ApiPropertyOptional({
    description: "Path to the movie poster",
    example: "/k1QUCjNAkfRpWfm1dVJGUmVHzGv.jpg",
  })
  @Expose()
  @IsOptional()
  @IsString({ message: "posterPath must be a string" })
  posterPath?: string;

  @ApiPropertyOptional({
    description: "Path to the movie backdrop image",
    example: "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
  })
  @Expose()
  @IsOptional()
  @IsString({ message: "backdropPath must be a string" })
  @Trim()
  @MinLength(2, { message: "backdropPath must be at least 2 characters long" })
  @MaxLength(300, {
    message: "backdropPath must not exceed 300 characters",
  })
  backdropPath?: string;

  // Trailer
  @ApiPropertyOptional({
    description: "YouTube video ID of the trailer",
    example: "SUXWAEX2jlg",
  })
  @Expose()
  @IsOptional()
  @IsString({ message: "videoId must be a string" })
  videoId?: string;
}
