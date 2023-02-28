import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  patient_name: string;

  @IsString()
  @IsNotEmpty()
  order_type: string;

  @IsNumber()
  patient_bed: number;

  // @IsNumber()
  // from_id: number; // the ward requiring

  @IsNumber()
  to_id: number; // the ward receiving

  // @IsString()
  // @IsNotEmpty()
  // requested_by: string; // user info that places the order

  @IsNumber()
  @IsOptional()
  ventilator_id?: number; // the ventilator_id may be selected from the dispatcher (in some cases, e.g. only one available, may be set on order created)

  @IsString()
  @IsOptional()
  obs: string;

  // @IsOptional()
  // @IsString()
  // @IsIn(['PENDING', 'DISPATCHED', 'RETURNED', 'CLOSED'])
  // status: 'PENDING' | 'DISPATCHED' | 'RETURNED' | 'CLOSED';

  // @IsString()
  // dispatched_by: string; // because the order was not yet dispatched, this is null

  // relations
  // ventilator: Ventilator;
  // to_park: Ward;
  // from_srv: Ward;
}
