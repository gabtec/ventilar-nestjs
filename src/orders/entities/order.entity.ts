/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ventilator } from 'src/ventilators/entities/ventilator.entity';
import { Ward } from 'src/wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_name: string;

  @Column()
  patient_bed: number;

  @Column('varchar', { length: 12 })
  status: 'PENDING' | 'DISPATCHED' | 'CLOSED';

  @Column()
  from_id: number; // the ward requiring

  @OneToOne((type) => Ward)
  @JoinColumn({ name: 'from_id' })
  from_srv: Ward;

  @Column()
  to_id: number; // the ward receiving

  @OneToOne((type) => Ward)
  @JoinColumn({ name: 'to_id' })
  to_park: Ward;

  @Column()
  requested_by: number; // userID that places the order

  @Column()
  dispatched_by: number; // userID that delivers the order

  @Column()
  ventilator_id: number;

  @OneToOne((type) => Ventilator)
  @JoinColumn({ name: 'ventilator_id' })
  ventilator: Ventilator;

  @Column('text')
  obs: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
