import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
