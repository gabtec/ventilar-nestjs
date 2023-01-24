import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAll() {
    return await this.usersRepository.find();
  }

  async getUsersByWard(id: number) {
    console.log('Service ID: ' + id);
    return await this.usersRepository.find({
      // relations: { workplace: true },
      relations: ['workplace'],
      where: {
        workplaceId: id,
      },
    });
  }
}
