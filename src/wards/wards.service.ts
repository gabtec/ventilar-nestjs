import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ward } from './entities/ward.entity';

@Injectable()
export class WardsService {
  constructor(
    @InjectRepository(Ward) private readonly wardsRepository: Repository<Ward>,
  ) {}

  async getAll() {
    return await this.wardsRepository.find();
  }
}
