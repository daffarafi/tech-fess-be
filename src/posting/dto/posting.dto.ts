import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class PostingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;

  @IsBoolean()
  isPrivate: boolean;
}
