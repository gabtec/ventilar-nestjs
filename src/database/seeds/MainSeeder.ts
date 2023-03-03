import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Ward } from '../../wards/entities/ward.entity';
import WardSeeder from '../../wards/seeds/ward.seeder';
import { User } from '../../users/entities/user.entity';
import UserSeeder from '../../users/seeds/user.seeder';
import { Ventilator } from '../../ventilators/entities/ventilator.entity';
import VentilatorSeeder from '../../ventilators/seeds/ventilator.seeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // before all, drop tables
    await dataSource
      .getRepository(Ward)
      .query('TRUNCATE t_wards RESTART IDENTITY CASCADE;');
    await dataSource
      .getRepository(User)
      .query('TRUNCATE t_users RESTART IDENTITY CASCADE;');
    await dataSource
      .getRepository(Ventilator)
      .query('TRUNCATE t_ventilators RESTART IDENTITY CASCADE;');

    await runSeeder(dataSource, WardSeeder);
    await runSeeder(dataSource, UserSeeder);
    await runSeeder(dataSource, VentilatorSeeder);
    // await runSeeder(dataSource, OrderSeeder);
  }
}
