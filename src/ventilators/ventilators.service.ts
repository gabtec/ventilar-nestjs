import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const vent = await this.ventsRepo.findOneBy({ id });
    if (!vent) {
      throw new NotFoundException();
    }
    return vent;
    // return await this.ventsRepo.find({ relations: ['park'], where: { id } });
  }

  async getVentilatorsByPark(parkId: number) {
    const vents = await this.ventsRepo.find({
      relations: ['park'],
      where: {
        parked_at: parkId,
      },
    });

    return vents;
    // return await this.ventsRepo.find({ relations: ['park'], where: { id } });
  }

  async create(ventilatorDto: CreateVentilatorDto) {
    // const park = await this.wardsRepo.findOneBy({
    //   id: ventilatorDto.parked_at,
    // });

    // const vent = await this.ventsRepo.create(ventilatorDto);

    try {
      return await this.ventsRepo.save(ventilatorDto);
    } catch (error) {
      if (error.message.includes('violates unique constraint')) {
        throw new ConflictException('Ventilator serial number must be unique!'); // can show this msg because is unique "unique" field
      }
      throw error;
    }
  }
}
