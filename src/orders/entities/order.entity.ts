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

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 12 })
  status: ['PENDING', 'DISPATCHED', 'CLOSED'];

  @Column()
  from_id: number; // the ward requiring

  @OneToOne((type) => Ward)
  @JoinColumn({ name: 'from_id' })
  from_srv: Ward;

  @Column()
  to: number; // the ward receiving

  @Column()
  requested_by: number; // userID that places the order

  @Column()
  dispatched_by: number; // userID that delivers the order

  @Column()
  ventilator_id: number;

  @Column('text')
  obs: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
