import { IsString } from 'class-validator';

export class LoginCredentialsDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
