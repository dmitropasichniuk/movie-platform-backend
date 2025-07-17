import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsInt,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { Trim } from "@decorators";

export class GenreFromApiDto {
  @ApiProperty({
    description: "Unique numeric identifier of the genre",
    example: 28,
  })
  @IsNotEmpty({ message: "id must not be empty" })
  @IsInt({ message: "id must be an integer" })
  @Type(() => Number)
  id: number;

  @ApiProperty({
    description: "Name of the movie genre",
    example: "Action",
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: "Name must not be empty" })
  @IsString({ message: "Name must be a string" })
  @Trim()
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(50, { message: "Name must not exceed 50 characters" })
  name: string;
}
