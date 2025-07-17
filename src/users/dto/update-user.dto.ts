import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsInt,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { Trim } from "@decorators";

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "User nickname",
    example: "TestNick",
  })
  @IsOptional()
  @IsString({ message: "userName must be a string" })
  @Trim()
  @MinLength(2, { message: "userName must be at least 2 characters long" })
  @MaxLength(50, { message: "userName must not exceed 50 characters" })
  userName?: string;

  @ApiPropertyOptional({
    description: "User email address",
    example: "john.doe@example.com",
  })
  @IsOptional()
  @IsEmail({}, { message: "Invalid email format" })
  @Trim()
  email?: string;

  @ApiPropertyOptional({
    description: "User first name",
    example: "Firstname",
  })
  @IsOptional()
  @IsString({ message: "First name must be a string" })
  @Trim()
  @MinLength(2, { message: "First name must be at least 2 characters long" })
  @MaxLength(50, { message: "First name must not exceed 50 characters" })
  firstName?: string;

  @ApiPropertyOptional({
    description: "User last name",
    example: "Lastname",
  })
  @IsOptional()
  @IsString({ message: "Last name must be a string" })
  @Trim()
  @MinLength(2, { message: "Last name must be at least 2 characters long" })
  @MaxLength(50, { message: "Last name must not exceed 50 characters" })
  lastName?: string;

  @ApiPropertyOptional({
    description: "User phone number in +380... format",
    example: "+380991234567",
  })
  @IsOptional()
  @IsPhoneNumber("UA", { message: "Invalid phone number format" })
  phone?: string;

  @ApiPropertyOptional({
    description: "User age",
    example: 25,
  })
  @IsOptional()
  @IsInt({ message: "age must be an integer" })
  @Min(1, { message: "age must be greater than 0" })
  @Type(() => Number)
  age?: number = 1;

  @ApiPropertyOptional({
    description: "URL to the user's avatar image",
    example: "https://site.com/uploads/avatar.jpg",
  })
  @IsOptional()
  @IsString({ message: "Avatar must be a string" })
  @Trim()
  @MinLength(2, { message: "Avatar must be at least 2 characters long" })
  @MaxLength(250, { message: "Avatar must not exceed 250 characters" })
  avatar?: string;
}
