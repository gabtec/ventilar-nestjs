/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'src/users/entities/user.entity';
import { Ventilator } from 'src/ventilators/entities/ventilator.entity';
import { Ward } from 'src/wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @Column('varchar', { default: 'PENDING', length: 12 })
  status: 'PENDING' | 'DISPATCHED' | 'CLOSED';

  @Column({ default: true })
  is_active: boolean;

  @Column()
  from_id: number; // the ward requiring

  @Column()
  to_id: number; // the ward receiving

  @OneToMany(() => Ward, (ward) => ward.orders)
  @JoinColumn([
    { name: 'from_id', referencedColumnName: 'id' },
    { name: 'to_id', referencedColumnName: 'id' },
  ])
  ward: Ward;

  @Column()
  ventilator_id: number;

  @ManyToMany((type) => Ventilator, (vent) => vent.id)
  @JoinColumn({ name: 'ventilator_id' })
  ventilator: Ventilator;

  @Column('text')
  obs: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  /*  This is kind of info logs.
      The recomendeation, for now, is:
      (user.mec) user.name
      (3001) John Doe
   */
  @Column()
  requested_by: string; // user info that places the order

  @Column({ nullable: true })
  dispatched_by: string; // user info that delivers the order

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
}
