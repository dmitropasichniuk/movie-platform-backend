import { Expose, Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { Trim } from "@decorators";

export class GenreResponseDto {
  @ApiProperty({
    description: "Unique external genre ID from TMDB",
    example: 28,
  })
  @Expose()
  @IsNotEmpty({ message: "externalId must not be empty" })
  @IsInt({ message: "externalId must be an integer" })
  @Type(() => Number)
  externalId: number;

  @ApiProperty({
    description: "Name of the movie genre",
    example: "Action",
    minLength: 2,
    maxLength: 50,
  })
  @Expose()
  @IsNotEmpty({ message: "name must not be empty" })
  @IsString({ message: "name must be a string" })
  @Trim()
  @MinLength(2, { message: "name must be at least 2 characters long" })
  @MaxLength(50, { message: "name must not exceed 50 characters" })
  name: string;
}
