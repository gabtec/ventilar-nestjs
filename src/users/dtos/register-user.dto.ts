import { IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  @MinLength(4)
  readonly password: string;
}
