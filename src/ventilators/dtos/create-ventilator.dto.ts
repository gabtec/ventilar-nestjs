import { IsNumber, IsString } from 'class-validator';

export class CreateVentilatorDto {
  @IsString()
  readonly brand: string;

  @IsString()
  readonly model: string;

  @IsString()
  readonly serial: string;

  @IsString({ each: true })
  readonly category: 'VI' | 'VNI';

  @IsNumber()
  readonly parked_at: number;
}
