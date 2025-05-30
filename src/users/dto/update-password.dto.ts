import {
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Old Password не може бути порожнім' })
  @IsString({ message: 'Пароль повинен бути рядком' })
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Пароль повинен містити великі та малі літери, цифри та спеціальні символи',
    },
  )
  oldPassword: string;

  @IsNotEmpty({ message: 'New Password не може бути порожнім' })
  @IsString({ message: 'Пароль повинен бути рядком' })
  @MinLength(6, { message: 'Пароль повинен містити мінімум 6 символів' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Пароль повинен містити великі та малі літери, цифри та спеціальні символи',
    },
  )
  password?: string;
}
