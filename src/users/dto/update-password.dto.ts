import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @ApiProperty({
    description:
      "Current password. Must contain uppercase/lowercase letters, a digit, and a special character.",
    example: "OldPassword1@",
    minLength: 6,
  })
  @IsNotEmpty({ message: "Old password must not be empty" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain uppercase and lowercase letters, a digit, and a special character",
  })
  oldPassword: string;

  @ApiProperty({
    description:
      "New password. Must contain uppercase/lowercase letters, a digit, and a special character.",
    example: "NewPassword1@",
    minLength: 6,
  })
  @IsNotEmpty({ message: "New password must not be empty" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain uppercase and lowercase letters, a digit, and a special character",
  })
  newPassword: string;
}
