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

  // @Column({ nullable: true })
  // image: string;

  @Column('varchar', { length: 4 })
  category: 'VI' | 'VNI';

  @Column({ default: true })
  is_free: boolean;

  // --- relation with Ward
  // @Column({ unique: false, nullable: true })
  @Column()
  park_id: number | null; // ward_id where it's placed

  @ManyToOne(() => Ward, (park) => park.ventilators, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'park_id' })
  park: Ward;

  // // --- relation with Ventilator
  // @OneToMany(() => Order, (order) => order.ventilator_id, {
  //   nullable: true,
  // })
  // orders: Order[];

  // timestamps
  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
