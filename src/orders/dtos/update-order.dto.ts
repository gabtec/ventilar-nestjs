import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';

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
  ventilator_id?: string;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsOptional()
  @IsBoolean()
  is_closed?: boolean;

  @IsOptional()
  @IsString()
  action?: string; // DISPATCH | DELIVER | RECEIVE
}
