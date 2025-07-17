import {
  IsOptional,
  IsString,
  IsArray,
  Min,
  Max,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsInt,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class MovieFilterDto {
  @ApiPropertyOptional({
    description: "Search by movie title",
    example: "Interstellar",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Array of genre IDs to filter by",
    example: [28, 12, 16],
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: "genreIds must be an array of numbers" })
  @IsInt({
    each: true,
    message: "Each element in genreIds must be an integer",
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((v) => parseInt(v, 10));
    return [parseInt(value, 10)];
  })
  genreIds?: number[];

  @ApiPropertyOptional({
    description: "Movie release year",
    example: 2014,
    minimum: 2000,
    maximum: 2030,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(2000)
  @Max(2030)
  releaseYear?: number;

  @ApiPropertyOptional({
    description: "Adult content",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === "true" ? true : value === "false" ? false : undefined
  )
  adult?: boolean;

  @ApiPropertyOptional({
    description: "Field to sort by",
    enum: ["title", "releaseDate", "popularity", "voteAverage", "voteCount"],
    example: "title",
  })
  @IsOptional()
  @IsString()
  @IsEnum(["title", "releaseDate", "popularity", "voteAverage", "voteCount"])
  sortBy?: string;

  @ApiPropertyOptional({
    description: "Sorting order",
    enum: ["ASC", "DESC"],
    example: "ASC",
  })
  @IsOptional()
  @IsString()
  @IsEnum(["ASC", "DESC"])
  order?: "ASC" | "DESC";

  @ApiProperty({
    description: "Page number",
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number;
}
