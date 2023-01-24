import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardsModule } from './wards/wards.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'vpark_db',
      autoLoadEntities: true,
      synchronize: true, // TODO: disable in production
    }),
    WardsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
