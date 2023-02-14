import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWardDto } from './dtos/create-ward.dto';
import { Ward } from './entities/ward.entity';

@Injectable()
export class WardsRepository {
  // constructor(@InjectEntityManager() private user: User) {}
  constructor(
    @InjectRepository(Ward) private readonly wardsRepository: Repository<Ward>,
  ) {}

  async findOneById(id: number): Promise<Ward> {
    return await this.wardsRepository.findOneBy({ id });
  }

  async findAll(limit: number, offset: number): Promise<Ward[]> {
    return await this.wardsRepository.find({ skip: offset, take: limit });
  }

  async findAllVentsInThisWard(id: number): Promise<any[]> {
    return await this.wardsRepository.find({
      where: { id },
      relations: ['ventilators'],
    });
  }

  async create(createWardDto: CreateWardDto): Promise<Ward> {
    return await this.wardsRepository.save(createWardDto);
  }

  // to use with tests
  async clearTable(id: number, runningMode: string) {
    if (runningMode !== 'test') {
      return;
    }

    // return await this.wardsRepository.clear();
    // return await this.wardsRepository.query('TRUNCATE TABLE t_wards CASCADE');
    return await this.wardsRepository.delete(id);
  }
}
