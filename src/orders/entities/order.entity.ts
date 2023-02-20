import { Ventilator } from 'src/ventilators/entities/ventilator.entity';
import { Ward } from 'src/wards/entities/ward.entity';
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

  @Column({ unique: false })
  from_id: number; // the ward requiring

  @Column({ unique: false, nullable: true })
  to_id: number; // the ward receiving

  @ManyToOne(() => Ward, (ward) => ward.orders, { onDelete: 'SET NULL' })
  // @JoinColumn([
  //   {
  //     name: 'from_id',
  //     referencedColumnName: 'id',
  //   },
  //   {
  //     name: 'to_id',
  //     referencedColumnName: 'id2',
  //   },
  // ])
  ward: Ward;

  // MUST validate on create new order, if a requested ventilator_id is in another active Order
  // then it can not be used on new Order, until that active order is et to closed
  @Column({ unique: false, nullable: true })
  ventilator_id: number;

  @ManyToOne(() => Ventilator, (vent) => vent.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'ventilator_id' })
  // @Check(`"ventilator.status" <> 'active' AND "order.status" = 'PENDING'`)
  ventilator?: Ventilator;

  @Column('text', { nullable: true })
  obs?: string;

  /*  This is kind of info logs.
      The recomendation, for now, is:
      (user.mec) user.name
      (3001) John Doe
   */

  // @Column()
  // requested_by: number; // userID that places the order

  // @Column()
  // dispatched_by: number; // userID that delivers the order

  // @OneToMany(() => User, (user) => user.orders)
  // @JoinColumn([
  //   { name: 'requested_by', referencedColumnName: 'id' },
  //   { name: 'dispatched_by', referencedColumnName: 'id' },
  // ])
  // user: User;

  @Column()
  created_by: string; // user info that places the order

  @Column({ nullable: true })
  dispatched_by: string; // user info that delivers the order

  @Column()
  updated_by: string; // user info that updates order, e.g. cancel it before dispatched

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
