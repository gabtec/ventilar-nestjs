import { Ward } from 'src/wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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
  category: ['VI', 'VNI'];

  @Column()
  parked_at: number; // ward_id where it's placed

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Ward, (park) => park.ventilators)
  @JoinColumn({ name: 'parked_at' })
  park: Ward;

  // @Column()
  // status: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
