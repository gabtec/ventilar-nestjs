import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @Min(1000)
  @Max(9998)
  @IsNotEmpty()
  readonly mec: number;

  @IsString()
  @IsOptional()
  readonly role?: string | null | undefined;

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  readonly password_confirm: string;

  @IsString()
  @IsNotEmpty()
  readonly refresh_token_hash: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly workplace_id?: number | null | undefined;
}
