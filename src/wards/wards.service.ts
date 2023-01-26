import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWardDto } from './dtos/create-ward.dto';
import { Ward } from './entities/ward.entity';

@Injectable()
export class WardsService {
  constructor(
    @InjectRepository(Ward) private readonly wardsRepository: Repository<Ward>,
  ) {}

  async getAll() {
    return await this.wardsRepository.find();
  }

  async getAllVentilatorsInAPark(id: number) {
    return await this.wardsRepository.find({
      where: { id },
      relations: ['ventilators'],
    });
  }

  async create(createWardDto: CreateWardDto) {
    return this.wardsRepository.save(createWardDto);
  }
}
