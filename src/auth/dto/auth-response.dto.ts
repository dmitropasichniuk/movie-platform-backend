import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { UserResponseDto } from "@users";

export class AuthResponseDto {
  @ApiProperty({
    description: "JWT access token for an authorized user",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: "User data",
    type: () => UserResponseDto,
  })
  @Expose()
  @ValidateNested()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
