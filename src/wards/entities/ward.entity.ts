import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Ventilator } from 'src/ventilators/entities/ventilator.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_wards')
export class Ward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  institution: string;

  @Column({ default: false })
  is_park: boolean;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  // ------ Relations -------------
  @OneToMany(() => User, (user) => user.workplace)
  users: User[];

  @OneToMany(() => Ventilator, (vent) => vent.park)
  ventilators: Ventilator[];

  @OneToMany(() => Order, (order) => order.ward, {
    onDelete: 'SET NULL',
  })
  orders: Order[];
}
