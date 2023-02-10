import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardsModule } from './wards/wards.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { VentilatorsModule } from './ventilators/ventilators.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true, // this avoids having to import ConfigModule in other modules
      // ignoreEnvFile: true, // in production ignore env because docker e.g. will inject env in another way
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: any) => {
        return {
          // type: 'postgres',
          type: configService.get('database.driver'),
          // host: configService.get('DB_HOST', 'localhost'),
          host: configService.get('database.host'),
          // port: parseInt(configService.get('DB_PORT', '5432'), 10),
          port: configService.get('database.port'),
          // username: configService.get('DB_USER'),
          username: configService.get('database.user'),
          // password: configService.get('DB_PASSWORD'),
          password: configService.get('database.password'),
          // database: configService.get('DB_NAME'),
          database: configService.get('database.name'),
          autoLoadEntities: true,
          synchronize: configService.get('database.disableOrmSync'), // TODO: disable in production
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'admin',
    //   password: 'admin',
    //   database: 'vpark_db',
    //   autoLoadEntities: true,
    //   synchronize: true, // TODO: disable in production
    // }),
    WardsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    VentilatorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
