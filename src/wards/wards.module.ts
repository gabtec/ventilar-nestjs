import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from 'src/auth/auth.module';
import { Ventilator } from 'src/ventilators/entities/ventilator.entity';
import { Ward } from './entities/ward.entity';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';

@Module({
  // imports: [TypeOrmModule.forFeature([Ward, Ventilator]), AuthModule],
  imports: [TypeOrmModule.forFeature([Ward, Ventilator])],
  controllers: [WardsController],
  providers: [WardsService],
  // exports: [WardsModule],
})
export class WardsModule {}
