import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class EditUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  displayName: string;

  @IsString()
  @MaxLength(280)
  @IsOptional()
  biodata?: string;
}
