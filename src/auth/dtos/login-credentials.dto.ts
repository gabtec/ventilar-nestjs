import { IsNumber, IsPositive, IsString } from 'class-validator';

export class LoginCredentialsDto {
  @IsNumber()
  @IsPositive()
  readonly username: number;

  @IsString()
  readonly password: string;
}
