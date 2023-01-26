import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  readonly password_confirm: string;
}
