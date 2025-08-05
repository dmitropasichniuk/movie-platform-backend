import { Exclude, Expose } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@enums";

export class UserResponseDto {
  @ApiProperty({
    description: "Unique UUID of the user",
    example: "2fba6718-f3ad-4d44-bb98-7a0d4e5edabc",
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: "User nickname",
    example: "TestNick",
  })
  @Expose()
  userName: string;

  @ApiPropertyOptional({
    description: "User first name",
    example: "Firstname",
  })
  @Expose()
  firstName?: string;

  @ApiPropertyOptional({
    description: "User last name",
    example: "Lastname",
  })
  @Expose()
  lastName?: string;

  @ApiPropertyOptional({
    description: "User email address",
    example: "john.doe@example.com",
  })
  @Expose()
  email?: string;

  @ApiPropertyOptional({
    description: "User phone number in +380... format",
    example: "+380991234567",
  })
  @Expose()
  phone?: string;

  @ApiPropertyOptional({
    description: "User age",
    example: 25,
  })
  @Expose()
  age?: number;

  @ApiPropertyOptional({
    description: "URL to the user's avatar image",
    example: "https://site.com/uploads/avatar.jpg",
  })
  @Expose()
  avatar?: string;

  @ApiProperty({
    description: "User role",
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @Expose()
  role: UserRole;

  @ApiProperty({
    description: "Full name of the user (firstName + lastName)",
    example: "Firstname Lastname",
  })
  @Expose()
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return null;
  }

  // Exclude sensitive data
  @Exclude()
  password: string;
}
