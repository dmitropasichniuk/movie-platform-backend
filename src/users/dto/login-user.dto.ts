import {
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Trim } from "@decorators";

export class LoginUserDto {
  @ApiProperty({
    description: "Unique username",
    example: "JohnDoe",
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: "userName must not be empty" })
  @IsString({ message: "userName must be a string" })
  @Trim()
  @MinLength(2, { message: "userName must be at least 2 characters long" })
  @MaxLength(50, { message: "userName must not exceed 50 characters" })
  userName: string;

  @ApiProperty({
    description:
      "Password must contain uppercase/lowercase letters, a digit, and a special character",
    example: "Password1@",
    minLength: 6,
  })
  @IsNotEmpty({ message: "Password must not be empty" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain uppercase and lowercase letters, a digit, and a special character",
  })
  password: string;
}
