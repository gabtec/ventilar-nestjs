import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Ward } from 'src/wards/entities/ward.entity';
import { Ventilator } from './entities/ventilator.entity';
import { VentilatorsController } from './ventilators.controller';
import { VentilatorsService } from './ventilators.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ventilator, Ward]), AuthModule],
  controllers: [VentilatorsController],
  providers: [VentilatorsService],
})
export class VentilatorsModule {}
