import { Injectable } from '@nestjs/common';
import { CreateWardDto } from './dtos/create-ward.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { Ward } from './entities/ward.entity';
import { WardsRepository } from './wards.repository';

@Injectable()
export class WardsService {
  constructor(private readonly wardsRepo: WardsRepository) {}

  async getWardById(id: number): Promise<Ward> {
    return await this.wardsRepo.findOneById(id);
  }

  async getAll(limit?: number, offset?: number): Promise<Ward[]> {
    return await this.wardsRepo.findAll(limit, offset);
  }

  async create(createWardDto: CreateWardDto): Promise<Ward> {
    return this.wardsRepo.create(createWardDto);
  }

  async getAllVentilatorsInAPark(id: number) {
    return await this.wardsRepo.findAllVentsInThisWard(id);
  }

  async countVentilatorsByWardAndCategory(cat: 'VI' | 'VNI') {
    return await this.wardsRepo.countVentilatorsByWardAndCategory(cat);
  }
  // constructor(
  //   @InjectRepository(Ward) private readonly wardsRepository: Repository<Ward>,
  // ) {}

  // async getAll() {
  //   return await this.wardsRepository.find();
  // }

  // async getAllVentilatorsInAPark(id: number) {
  //   return await this.wardsRepository.find({
  //     where: { id },
  //     relations: ['ventilators'],
  //   });
  // }

  // async create(createWardDto: CreateWardDto) {
  //   return this.wardsRepository.save(createWardDto);
  // }
}
