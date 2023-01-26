import { IsString, MaxLength } from 'class-validator';

export class CreateWardDto {
  @IsString()
  readonly name: string;

  @IsString()
  @MaxLength(8)
  readonly belongs_to: string;
}
