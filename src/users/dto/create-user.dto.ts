import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsEnum,
  Matches,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

import { Trim } from 'src/common/decorators';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email не може бути порожнім' })
  @Trim()
  @IsEmail({}, { message: 'Неправильний формат email' })
  email: string;

  @IsNotEmpty({ message: 'First name не може бути порожнім' })
  @IsString({ message: "Ім'я повинно бути рядком" })
  @Trim()
  @MinLength(2, { message: "Ім'я повинно містити мінімум 2 символи" })
  @MaxLength(50, { message: "Ім'я не повинно перевищувати 50 символів" })
  firstName: string;

  @IsNotEmpty({ message: 'Last name не може бути порожнім' })
  @IsString({ message: 'Прізвище повинно бути рядком' })
  @Trim()
  @MinLength(2, { message: 'Прізвище повинно містити мінімум 2 символи' })
  @MaxLength(50, { message: 'Прізвище не повинно перевищувати 50 символів' })
  lastName: string;

  @IsOptional()
  @IsPhoneNumber('UA', { message: 'Невірний формат номера телефону' })
  phone?: string;
  
  @IsInt({ message: 'age повинна бути цілим числом' })
  @Min(1, { message: 'age повинна бути більше 0' })
  @Type(() => Number)
  age?: number = 1;

  @IsNotEmpty({ message: 'Password не може бути порожнім' })
  @IsString({ message: 'Пароль повинен бути рядком' })
  @MinLength(6, { message: 'Пароль повинен містити мінімум 6 символів' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Пароль повинен містити великі та малі літери, цифри та спеціальні символи',
    },
  )
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Невірна роль користувача' })
  role?: UserRole;
}
