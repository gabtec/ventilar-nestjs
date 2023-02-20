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
  @IsIn(['PENDING', 'DISPATCHED', 'RETURNED', 'CLOSED'])
  status?: 'PENDING' | 'DISPATCHED' | 'RETURNED' | 'CLOSED';

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
  @IsString()
  ventilator_id?: string;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsOptional()
  @IsBoolean()
  is_closed?: boolean;
}
