import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from './seeds/MainSeeder';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env` });

const options: DataSourceOptions & SeederOptions = {
  type: (process.env.DB_DRIVER as any) || 'postgres',
  host: (process.env.DB_HOST as any) || 'localhost',
  port: (process.env.DB_PORT as any) || 5432,
  username: (process.env.DB_USER as any) || 'admin',
  password: (process.env.DB_PASSWORD as any) || 'admin',
  database: (process.env.DB_NAME as any) + '_test' || 'ventilar_db_test',
  entities: [`./dist/**/*.entity.js`],
  synchronize: false,
  migrations: [`./dist/database/migrations/*.{js,ts}`],
  seeds: [MainSeeder],
};

export const AppDataSource = new DataSource(options);
