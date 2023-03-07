import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Ward } from 'src/wards/entities/ward.entity';
import { Repository } from 'typeorm';
import { CreateVentilatorDto } from './dtos/create-ventilator.dto';
import { Ventilator } from './entities/ventilator.entity';

@Injectable()
export class VentilatorsService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Ventilator)
    private readonly ventsRepo: Repository<Ventilator>,
    @InjectRepository(Ward)
    private readonly wardsRepo: Repository<Ward>,
  ) {}

  async getVentilatorById(id: number) {
    // const vent = await this.ventsRepo.findOneBy({ id });
    const vent = await this.ventsRepo.findOne({
      where: { id },
      relations: ['park'],
    });
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
        park_id: parkId,
      },
    });

    return vents;
    // return await this.ventsRepo.find({ relations: ['park'], where: { id } });
  }

  async getVentilatorsAndCountByWardAndCat(category: 'VNI' | 'VI') {
    const vents = await this.ventsRepo.find({
      relations: ['park'],
      where: {
        is_free: true,
        category: category,
      },
    });

    return groupAndCountByWard(vents);
    // return vents;
    // return await this.ventsRepo.find({ relations: ['park'], where: { id } });
  }

  async create(ventilatorDto: CreateVentilatorDto) {
    if (ventilatorDto.park_id != null) {
      // when NOT undefined, null or zero
      const ward = await this.wardsRepo.findOneBy({
        id: ventilatorDto.park_id,
      });
      if (!ward) throw new NotFoundException('Destiny ward not found!');

      if (ward && ward.is_park !== true)
        throw new BadRequestException(
          'Can not assign a ventilator to a non park ward.',
        );
    }

    try {
      return await this.ventsRepo.save(ventilatorDto);
    } catch (error) {
      if (error.message.includes('violates unique constraint')) {
        throw new ConflictException('Ventilator serial number must be unique!'); // can show this msg because is unique "unique" field
      }
      throw error;
    }
  }

  async updateStatus(ventID: number, isAvailable = false) {
    return this.ventsRepo.update(ventID, { is_free: isAvailable });
  }

  async clearTable() {
    const runningMode = this.configService.get('NODE_ENV');
    console.log(runningMode);

    if (runningMode !== 'test') {
      return;
    }

    return this.ventsRepo.clear();
  }
}

function groupAndCountByWard(list) {
  console.log(list);
  // TODO: this should be done from database
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
