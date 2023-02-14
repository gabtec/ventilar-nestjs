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

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @Min(1000)
  @Max(9998)
  @IsOptional()
  readonly mec?: number;

  @IsString()
  @IsOptional()
  readonly role?: string | null | undefined;

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @MinLength(4)
  @IsOptional()
  readonly password_confirm?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly workplace_id?: number | null | undefined;
}
