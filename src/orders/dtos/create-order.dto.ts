import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  status: 'PENDING' | 'DISPATCHED' | 'CLOSED';

  @IsString()
  patient_name: string;

  @IsNumber()
  patient_bed: number;

  @IsNumber()
  from_id: number; // the ward requiring

  @IsNumber()
  to_id: number; // the ward receiving

  @IsString()
  requested_by: number; // userID that places the order

  @IsString()
  dispatched_by: number; // userID that delivers the order

  @IsNumber()
  ventilator_id: number;

  @IsString()
  obs: string;

  // relations
  // ventilator: Ventilator;
  // to_park: Ward;
  // from_srv: Ward;
}
