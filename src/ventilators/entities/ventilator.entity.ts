import { Order } from 'src/orders/entities/order.entity';
import { Ward } from 'src/wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_ventilators')
export class Ventilator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  serial: string;

  @Column('varchar', { length: 4 })
  category: 'VI' | 'VNI';

  @Column({ unique: false })
  parked_at: number; // ward_id where it's placed

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToOne((type) => Ward, (park) => park.ventilators, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parked_at' })
  park: Ward;

  // @Column()
  // status: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Order, (order) => order.ventilator_id)
  orders: Order[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
