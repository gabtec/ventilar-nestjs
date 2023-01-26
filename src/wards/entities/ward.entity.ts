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

  @Column()
  name: string;

  @Column()
  belongs_to: string;

  @OneToMany(() => User, (user) => user.workplace)
  users: User[];

  @OneToMany(() => Ventilator, (vent) => vent.park)
  ventilators: Ventilator[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Order, (order) => order.from_srv)
  orders: Order[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
