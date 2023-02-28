import { Ward } from 'src/wards/entities/ward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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
  @Index()
  mec: number;

  @Column()
  name: string;

  @Column({ default: 'consumer' })
  role: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  refresh_token: string; // a hash

  @Column({ nullable: true }) // because admin user may not have workplace defined
  workplace_id: number | null;

  // @Column({ nullable: true }) //optional: because admin may not have workplace
  // @ManyToOne(() => Ward, (ward) => ward.users, { eager: true })
  @ManyToOne(() => Ward, (ward) => ward.users, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'workplace_id', referencedColumnName: 'id' })
  workplace: Ward;

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ManyToMany((type) => Order, (order) => order.user)
  // orders: Order[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
