import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardsModule } from './wards/wards.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { VentilatorsModule } from './ventilators/ventilators.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432'), 10),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize:
            configService.get('STAGE') === 'production' ? false : true, // TODO: disable in production
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
