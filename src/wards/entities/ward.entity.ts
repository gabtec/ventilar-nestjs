import { User } from '../../users/entities/user.entity';
import { Ventilator } from '../../ventilators/entities/ventilator.entity';
import {
  AfterLoad,
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

  // ------ Relations -------------
  @OneToMany(() => Ventilator, (vent) => vent.park, {
    onDelete: 'SET NULL',
  })
  ventilators: Ventilator[];

  total_vni: number;
  free_vni: number;

  total_vi: number;
  free_vi: number;

  @AfterLoad()
  updateCounter() {
    this.total_vni = 0;
    this.free_vni = 0;
    this.total_vi = 0;
    this.free_vi = 0;

    if (this.ventilators?.length > 0) {
      this.ventilators.map((vent) => {
        if (vent.category === 'VI') {
          this.total_vi++;
          if (vent.is_free) {
            this.free_vi++;
          }
        } else {
          this.total_vni++;
          if (vent.is_free) {
            this.free_vni++;
          }
        }
      });
    }
  }

  @OneToMany(() => User, (user) => user.workplace, {
    onDelete: 'SET NULL',
  })
  users: User[];

  // @OneToMany(() => Order, (order) => order.ward, {
  //   onDelete: 'SET NULL',
  // })
  // orders: Order[];

  // ------ Timestamps -------------
  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}
