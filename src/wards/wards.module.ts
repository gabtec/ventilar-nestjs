import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Ward } from './entities/ward.entity';
import { WardsController } from './wards.controller';
import { WardsRepository } from './wards.repository';
import { WardsService } from './wards.service';

@Module({
  // imports: [TypeOrmModule.forFeature([Ward, Ventilator]), AuthModule],
  imports: [TypeOrmModule.forFeature([Ward]), AuthModule],
  controllers: [WardsController],
  providers: [WardsService, WardsRepository],
  exports: [WardsService, WardsRepository],
})
export class WardsModule {}
