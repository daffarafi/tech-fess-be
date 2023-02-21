import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupAuthDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  displayName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  username: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthdate: Date;

  @IsString()
  @MaxLength(280)
  @IsOptional()
  biodata?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
