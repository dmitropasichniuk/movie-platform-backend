import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsString,
  IsInt,
  IsArray,
  IsNumber,
  IsDateString,
  MinLength,
  MaxLength,
  IsOptional,
} from "class-validator";
import { Expose, Type } from "class-transformer";

import { Trim } from "@decorators";

export class MovieSanitizeDto {
  // Main info
  @ApiProperty({
    description: "External movie ID (from API)",
    example: 550,
    type: Number,
  })
  @Expose()
  @IsInt({ message: "externalId must be an integer" })
  @Type(() => Number)
  externalId: number;

  @ApiProperty({
    description: "Movie title",
    example: "Fight Club",
    minLength: 2,
    maxLength: 50,
  })
  @Expose()
  @IsString({ message: "title must be a string" })
  @Trim()
  @MinLength(2, { message: "title must be at least 2 characters long" })
  @MaxLength(50, { message: "title must not exceed 50 characters" })
  title: string;

  @ApiProperty({
    description: "Movie description",
    example:
      "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString({ message: "description must be a string" })
  description?: string;

  @ApiProperty({
    description: "Release date in ISO format",
    example: "1999-10-15",
    format: "date",
  })
  @Expose()
  @IsDateString({}, { message: "releaseDate must be a valid ISO date string" })
  releaseDate: string;

  // Secondary info
  @ApiProperty({
    description: "Original language (ISO code)",
    example: "en",
    minLength: 2,
    maxLength: 30,
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
    type: Boolean,
  })
  @Expose()
  @IsBoolean({ message: "adult must be a boolean value" })
  @Type(() => Boolean)
  adult: boolean;

  // Genre
  @ApiProperty({
    description: "Array of genre IDs",
    example: [18, 53, 35],
    type: [Number],
  })
  @Expose()
  @IsArray({ message: "genreIds must be an array of numbers" })
  @Type(() => Number)
  @IsInt({
    each: true,
    message: "Each genreId must be an integer",
  })
  genreIds: number[];

  // Statistics
  @ApiProperty({
    description: "Movie popularity score",
    example: 61.416,
    type: Number,
  })
  @Expose()
  @IsNumber({}, { message: "popularity must be a number" })
  @Type(() => Number)
  popularity: number;

  @ApiProperty({
    description: "Average user rating",
    example: 8.433,
    type: Number,
    minimum: 0,
    maximum: 10,
  })
  @Expose()
  @IsNumber({}, { message: "voteAverage must be a number" })
  @Type(() => Number)
  voteAverage: number;

  @ApiProperty({
    description: "Number of rating votes",
    example: 26280,
    type: Number,
  })
  @Expose()
  @IsInt({ message: "voteCount must be an integer" })
  voteCount: number;

  @ApiProperty({
    description: "Path to the movie poster",
    example: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString({ message: "posterPath must be a string" })
  posterPath?: string;

  @ApiProperty({
    description: "Path to the movie backdrop image",
    example: "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
    required: false,
    minLength: 2,
    maxLength: 300,
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
  @ApiProperty({
    description: "YouTube video ID of the movie trailer",
    example: "SUXWAEX2jlg",
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString({ message: "videoId must be a string" })
  videoId?: string;
}
