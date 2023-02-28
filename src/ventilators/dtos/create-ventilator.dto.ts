import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVentilatorDto {
  @IsString()
  readonly brand: string;

  @IsString()
  readonly model: string;

  @IsString()
  readonly serial: string;

  @IsString()
  @IsOptional()
  readonly image?: string;

  @IsString({ each: true })
  readonly category: 'VI' | 'VNI';

  @IsNumber()
  readonly park_id: number;
}
