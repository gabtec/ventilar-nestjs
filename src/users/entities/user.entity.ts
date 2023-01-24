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
  workplaceId: number;

  // @Column({ nullable: true }) //optional: because admin may not have workplace
  @ManyToOne(() => Ward, (ward) => ward.users)
  @JoinColumn()
  workplace: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
