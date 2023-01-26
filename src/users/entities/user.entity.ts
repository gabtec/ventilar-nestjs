import { Order } from 'src/orders/entities/order.entity';
import { Ward } from 'src/wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mec: number;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column()
  password_hash: string;

  @Column()
  workplace_id: number;
  // @Column()
  // ward_id: number;

  // @Column({ nullable: true }) //optional: because admin may not have workplace
  // @ManyToOne(() => Ward, (ward) => ward.users, { eager: true })
  @ManyToOne(() => Ward, (ward) => ward.users, { eager: true })
  @JoinColumn({ name: 'workplace_id' })
  // workplace: number;
  workplace: Ward;

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ManyToMany((type) => Order, (order) => order.user)
  // orders: Order[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
