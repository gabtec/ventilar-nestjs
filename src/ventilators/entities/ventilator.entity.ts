import { Order } from 'src/orders/entities/order.entity';
import { Ward } from 'src/wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column({ unique: true })
  serial: string;

  @Column('varchar', { length: 4 })
  category: 'VI' | 'VNI';

  @Column({ default: true })
  is_available: boolean;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  // --- relations
  @Column({ unique: false, nullable: true })
  parked_at: number | null; // ward_id where it's placed

  @ManyToOne(() => Ward, (park) => park.ventilators, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parked_at' })
  park: Ward;

  // @OneToMany(() => Order, (order) => order.ventilator_id, { cascade: true })
  // orders: Order[];
}
