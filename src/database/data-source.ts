import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from './seeds/MainSeeder';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Ventilator } from '../ventilators/entities/ventilator.entity';
import { Ward } from '../wards/entities/ward.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

// const port = process.env.DB_PORT as number | undefined

const options: DataSourceOptions & SeederOptions = {
  type: (process.env.DB_DRIVER as any) || 'postgres',
  host: (process.env.DB_HOST as any) || 'localhost', // process.env.DB_HOST
  port: (process.env.DB_PORT as any) || 5432, // port
  username: (process.env.DB_USER as any) || 'admin', // process.env.DB_USER
  password: (process.env.DB_PASSWORD as any) || 'admin', // process.env.DB_PASS
  database: (process.env.DB_NAME as any) || 'ventilar_db', // process.env.DB_NAME
  // entities: [`../**/entities/*.{ts,js}`],
  // entities: [`${__dirname}/../**/entities/*.{ts,js}`],
  // entities: [User, Ward, Ventilator, Order],
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  // migrations: [`${__dirname}/dist/database/migrations/*.{ts,js}`],
  seeds: [MainSeeder],
  // entities: [`${__dirname}/dist/src/**/entities/*.{ts,js}`],
  // migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
};
console.log(options);
export const AppDataSource = new DataSource(options);
