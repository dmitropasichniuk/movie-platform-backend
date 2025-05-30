import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { UserRole } from '../entities/user.entity';
import { Trim } from 'src/common/decorators';

export class QueryUsersDto {
  @IsOptional()
  @IsInt({ message: 'Сторінка повинна бути цілим числом' })
  @Min(1, { message: 'Сторінка повинна бути більше 0' })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'Ліміт повинен бути цілим числом' })
  @Min(1, { message: 'Ліміт повинен бути більше 0' })
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Пошук повинен бути рядком' })
  @Trim()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Невірна роль для фільтрації' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Сортування повинно бути рядком' })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Порядок сортування повинен бути ASC або DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}