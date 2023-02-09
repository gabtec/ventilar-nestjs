import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @IsIn(['PENDING', 'DISPATCHED', 'CLOSED'])
  status: 'PENDING' | 'DISPATCHED' | 'CLOSED';

  @IsString()
  @IsNotEmpty()
  patient_name: string;

  @IsNumber()
  patient_bed: number;

  @IsNumber()
  from_id: number; // the ward requiring

  @IsNumber()
  to_id: number; // the ward receiving

  @IsString()
  @IsNotEmpty()
  requested_by: string; // user info that places the order

  // @IsString()
  // dispatched_by: string; // because the order was not yet dispatched, this is null

  @IsNumber()
  ventilator_id: number;

  @IsString()
  obs: string;

  // relations
  // ventilator: Ventilator;
  // to_park: Ward;
  // from_srv: Ward;
}
