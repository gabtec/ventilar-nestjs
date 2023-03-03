import { User } from '../../users/entities/user.entity';
import { Ventilator } from '../../ventilators/entities/ventilator.entity';
import { Ward } from '../../wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_type: string; // what type of order it is. Maps to ventilator category

  @Column()
  patient_name: string;

  @Column()
  patient_bed: number;

  @Column('varchar', { default: 'PENDING', length: 12 })
  status: 'PENDING' | 'DISPATCHED' | 'RETURNED' | 'CLOSED';

  @Column({ default: false })
  is_closed: boolean;

  // @Column({ unique: false })
  // from_id: number; // the ward requiring

  // @Column({ unique: false, nullable: true })
  // to_id: number; // the ward receiving

  @ManyToOne(() => Ward, (ward) => ward.id)
  @JoinColumn({ name: 'from_id' })
  from: Ward;

  @ManyToOne(() => Ward, (ward) => ward.id)
  @JoinColumn({ name: 'to_id' })
  to: Ward;

  // MUST validate on create new order, if a requested ventilator_id is in another active Order
  // then it can not be used on new Order, until that active order is et to closed
  // @Column({ unique: false, nullable: true })
  // ventilator_id: number;
  // // @Check(`"ventilator.status" <> 'active' AND "order.status" = 'PENDING'`)

  @ManyToOne(() => Ventilator, (ventilator) => ventilator.id, { cascade: true })
  @JoinColumn({ name: 'ventilator_id' })
  ventilator: Ventilator;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'requested_by_id' })
  requested_by: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'dispatched_by_id' })
  dispatched_by: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'delivered_by_id' })
  delivered_by: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'received_by_id' })
  received_by: User;

  @Column('text', { nullable: true })
  obs?: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
