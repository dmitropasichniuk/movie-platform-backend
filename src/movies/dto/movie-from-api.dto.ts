import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  MinLength,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

import { Trim } from "@decorators";

export class MovieFromApiDto {
  // Ids
  @ApiProperty({
    description: "Unique movie ID from the external API",
    example: 550,
    type: Number,
  })
  @IsInt({ message: "id must be an integer" })
  id: number;

  @ApiProperty({
    description: "Movie title",
    example: "Fight Club",
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: "title must be a string" })
  @Trim()
  @MinLength(2, { message: "title must be at least 2 characters long" })
  @MaxLength(50, { message: "title must not exceed 50 characters" })
  title: string;

  @ApiProperty({
    description: "Original movie title",
    example: "Fight Club",
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: "original_title must be a string" })
  @Trim()
  @MinLength(2, {
    message: "original_title must be at least 2 characters long",
  })
  @MaxLength(50, {
    message: "original_title must not exceed 50 characters",
  })
  original_title: string;

  @ApiProperty({
    description: "Original language of the movie (ISO code)",
    example: "en",
    minLength: 2,
    maxLength: 30,
  })
  @IsString({ message: "original_language must be a string" })
  @Trim()
  @MinLength(2, {
    message: "original_language must be at least 2 characters long",
  })
  @MaxLength(30, {
    message: "original_language must not exceed 30 characters",
  })
  original_language: string;

  // Date
  @ApiProperty({
    description: "Movie release date in ISO format",
    example: "1999-10-15",
    format: "date",
  })
  @IsDateString({}, { message: "release_date must be a valid ISO date string" })
  release_date: string;

  // Genre
  @ApiProperty({
    description: "Array of genre IDs",
    example: [18, 53, 35],
    type: [Number],
  })
  @IsArray({ message: "genre_ids must be an array of numbers" })
  @Type(() => Number)
  @IsInt({
    each: true,
    message: "Each genre_id must be an integer",
  })
  genre_ids: number[];

  // Images
  @ApiProperty({
    description: "Path to the movie poster image",
    example: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "poster_path must be a string" })
  poster_path?: string;

  @ApiProperty({
    description: "Path to the movie backdrop image",
    example: "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
    required: false,
    minLength: 2,
    maxLength: 300,
  })
  @IsOptional()
  @IsString({ message: "backdrop_path must be a string" })
  @Trim()
  @MinLength(2, { message: "backdrop_path must be at least 2 characters long" })
  @MaxLength(300, {
    message: "backdrop_path must not exceed 300 characters",
  })
  backdrop_path?: string;

  // Description
  @ApiProperty({
    description: "Movie overview/description",
    example:
      "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "overview must be a string" })
  overview?: string;

  // Statistics
  @ApiProperty({
    description: "Movie popularity score",
    example: 61.416,
    type: Number,
  })
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
  @IsNumber({}, { message: "vote_average must be a number" })
  @Type(() => Number)
  vote_average: number;

  @ApiProperty({
    description: "Number of votes for the rating",
    example: 26280,
    type: Number,
  })
  @IsInt({ message: "vote_count must be an integer" })
  vote_count: number;

  // Params
  @ApiProperty({
    description: "Whether the movie is for adults",
    example: false,
    type: Boolean,
  })
  @IsBoolean({ message: "adult must be a boolean" })
  @Type(() => Boolean)
  adult: boolean;

  @ApiProperty({
    description: "Whether the movie is a video",
    example: false,
    type: Boolean,
  })
  @IsBoolean({ message: "video must be a boolean" })
  @Type(() => Boolean)
  video: boolean;
}
