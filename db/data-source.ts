import 'reflect-metadata';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Ventilator } from 'src/ventilators/entities/ventilator.entity';
import { Ward } from 'src/wards/entities/ward.entity';
import { DataSource } from 'typeorm';
// import * as dotenv from 'dotenv';

// dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'ventilar_db3',
  entities: [User, Ward, Ventilator, Order],
  migrations: ['dist/db/migrations/*.js'],
  // migrations: ['db/migrations/*.js'],
  // migrationsTableName: 'migrations',    // this is the default
  // logging: false,
  synchronize: false,
  // cli: {
  //   migrationsDir: 'dist/db/migrations/',
  //   // entitiesDir: 'dist/src/**/',
  // },
});
