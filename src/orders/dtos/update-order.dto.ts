import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsIn(['PENDING', 'DISPATCHED', 'CLOSED'])
  status?: 'PENDING' | 'DISPATCHED' | 'CLOSED';

  @IsOptional()
  @IsString()
  patient_name?: string;

  @IsOptional()
  @IsNumber()
  patient_bed?: number;

  @IsOptional()
  @IsString()
  dispatched_by?: string; // user info that places the order e.g (3000) John Doe

  @IsOptional()
  @IsNumber()
  ventilator_id?: number;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
