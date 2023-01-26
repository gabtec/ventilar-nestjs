import {
  IsNotEmpty,
  IsNumber,
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
  readonly role: string;

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  readonly password_confirm: string;

  @IsNumber()
  @IsPositive()
  readonly workplace_id: number;
}
