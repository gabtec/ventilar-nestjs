import { DataSource, DataSourceOptions } from 'typeorm/data-source';
// import * as dotenv from 'dotenv';

// dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'ventilar_db',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  // migrationsTableName: 'migrations',    // this is the default
  // logging: false,
  // synchronize: true,
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
