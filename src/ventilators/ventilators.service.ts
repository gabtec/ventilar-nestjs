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

  async getVentilatorsByStatus(category: 'VNI' | 'VI', status: string) {
    const vents = await this.ventsRepo.find({
      relations: ['park'],
      where: {
        is_available: status === 'free' ? true : false,
        category: category,
      },
    });

    return groupAndCountByWard(vents);
    // return vents;
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

function groupAndCountByWard(list) {
  // console.log(list);
  const group = {};

  const loops = list.length;
  let i = 0;
  for (i = 0; i < loops; i++) {
    const groupKey = list[i].park.name;

    if (group[groupKey]) {
      group[groupKey].count = group[groupKey].count + 1;
    } else {
      group[groupKey] = {
        count: 1,
        wardID: list[i].park.id,
        ventCategory: list[i].category,
      };
    }
  }

  const wards = Object.keys(group);
  const finalList = wards.map((ward) => {
    return {
      wardName: ward,
      wardID: group[ward].wardID,
      ventsAvailable: group[ward].count,
      ventCategory: group[ward].ventCategory.toLowerCase(),
    };
  });

  return finalList;
  // return {
  //   category: list[0].category,
  //   wards: group,
  // };
}
