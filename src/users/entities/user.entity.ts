import { Ward } from 'src/wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
