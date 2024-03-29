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
    ConfigModule.forRoot({
      envFilePath: `.env`,
      // envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true, // this avoids having to import ConfigModule in other modules
      // ignoreEnvFile: true, // in production ignore env because docker e.g. will inject env in another way
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: any) => {
        return {
          type: configService.get('DB_DRIVER', 'postgres'),
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432'), 10),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME', 'ventilar_db'),
          autoLoadEntities: true,
          synchronize:
            configService.get('NODE_ENV') === 'production' ? false : true,
          // migrationsRun: true,
        };
      },
    }),
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
