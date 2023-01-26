import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ward } from 'src/wards/entities/ward.entity';
import { Repository } from 'typeorm';
import { CreateVentilatorDto } from './dtos/create-ventilator.dto';
import { Ventilator } from './entities/ventilator.entity';

@Injectable()
export class VentilatorsService {
  constructor(
    @InjectRepository(Ventilator)
    private readonly ventsRepo: Repository<Ventilator>,
    @InjectRepository(Ward)
    private readonly wardsRepo: Repository<Ward>,
  ) {}

  async getVentilatorById(id: number) {
    return await this.ventsRepo.findOneBy({ id });
    // return await this.ventsRepo.find({ relations: ['park'], where: { id } });
  }

  async create(ventilatorDto: CreateVentilatorDto) {
    const park = await this.wardsRepo.findOneBy({
      id: ventilatorDto.parked_at,
    });

    const vent = await this.ventsRepo.create({ ...ventilatorDto, park });

    return await this.ventsRepo.save(vent);
    // return await this.ventsRepo.save(ventilatorDto);
  }
}
