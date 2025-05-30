import { IsEmail, IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email не може бути порожнім' })
  @IsEmail({}, { message: 'Невірний формат email' })
  email: string;

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
}
