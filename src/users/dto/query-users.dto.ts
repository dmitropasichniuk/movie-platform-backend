import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { SortOrder, UserRole } from "@enums";

export class QueryUsersDto {
  @ApiPropertyOptional({
    description: "Page number for pagination",
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt({ message: "Page must be an integer" })
  @Min(1, { message: "Page must be greater than 0" })
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Number of items per page",
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be greater than 0" })
  @Max(100, { message: "Limit must be less than 100" })
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "Search query by username/email",
    example: "john",
  })
  @IsOptional()
  @IsString({ message: "Search must be a string" })
  search?: string;

  @ApiPropertyOptional({
    description: "Filter by role",
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: "Invalid role for filtering" })
  role?: UserRole;

  @ApiPropertyOptional({
    description: "Field to sort by",
    example: "createdAt",
    default: "createdAt",
  })
  @IsOptional()
  @IsString({ message: "SortBy must be a string" })
  sortBy?: string = "createdAt";

  @ApiPropertyOptional({
    description: "Sorting order",
    enum: SortOrder,
    example: SortOrder.DESC,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder, {
    message: "Order must be either ASC or DESC",
  })
  order?: SortOrder;
}
