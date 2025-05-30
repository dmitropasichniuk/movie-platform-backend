import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsEnum,
  Matches,
} from 'class-validator';

import { UserRole } from '../entities/user.entity';
import { Trim } from 'src/common/decorators';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Невірний формат email' })
  @Trim()
  email?: string;

  @IsOptional()
  @IsString({ message: "Ім'я повинно бути рядком" })
  @Trim()
  @MinLength(2, { message: "Ім'я повинно містити мінімум 2 символи" })
  @MaxLength(50, { message: "Ім'я не повинно перевищувати 50 символів" })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Прізвище повинно бути рядком' })
  @Trim()
  @MinLength(2, { message: 'Прізвище повинно містити мінімум 2 символи' })
  @MaxLength(50, { message: 'Прізвище не повинно перевищувати 50 символів' })
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber('UA', { message: 'Невірний формат номера телефону' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Невірна роль користувача' })
  role?: UserRole;
}
