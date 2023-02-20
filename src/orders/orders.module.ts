import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Ventilator } from 'src/ventilators/entities/ventilator.entity';
import { VentilatorsModule } from 'src/ventilators/ventilators.module';
import { VentilatorsService } from 'src/ventilators/ventilators.service';
import { Ward } from 'src/wards/entities/ward.entity';
import { WardsModule } from 'src/wards/wards.module';
import { WardsRepository } from 'src/wards/wards.repository';
import { WardsService } from 'src/wards/wards.service';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    AuthModule,

    WardsModule,
    VentilatorsModule,
    TypeOrmModule.forFeature([Order, Ventilator, Ward]),
    // TypeOrmModule.forFeature([Ward, Order, Ventilator]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, WardsService, VentilatorsService, WardsRepository],
  // providers: [OrdersService, WardsService, WardsRepository],
})
export class OrdersModule {}
