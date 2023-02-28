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
    return await this.wardsRepository.find({
      skip: offset,
      take: limit,
      relations: ['ventilators'],
    });
  }

  async findAllVentsInThisWard(id: number): Promise<any[]> {
    return await this.wardsRepository.find({
      relations: ['ventilators'],
      where: { id, ventilators: { is_free: true } },
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

  async countVentilatorsByWardAndCategory(cat: 'VI' | 'VNI') {
    // return this.wardsRepository.find({
    //   relations: ['ventilators'],
    //   where: { ventilators: { category: cat } },
    // });
    return this.wardsRepository.query(`
      SELECT p.name, COUNT(v.is_free) FROM
        (
          SELECT w.id, w.name FROM t_wards as w
          WHERE w.is_parK=true
        ) as p
      LEFT JOIN t_ventilators as v
      ON v.park_id=p.id
      WHERE v.category='${cat.toUpperCase()}'
      AND v.is_free=true
      GROUP BY p.name;
    `);
  }
}
