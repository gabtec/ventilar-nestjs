import { IsString, Length, Min } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  @Length(4)
  readonly password: string;
}
