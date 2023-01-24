import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/auth/crypto.service';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cryptoService: CryptoService,
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

  async register(userDto: RegisterUserDto) {
    const usersCount = await this.usersRepository.count();
    console.log(usersCount);
    if (usersCount > 0) {
      throw new NotFoundException('Route Not Found!');
    }

    console.log('you can register');
    const hash = await this.cryptoService.hashPassword(userDto.password);

    const admin = this.usersRepository.create({
      name: userDto.name,
      mec: 9999,
      role: 'admin',
      workplaceId: 1,
      password_hash: hash,
    });
    console.log(admin);

    return this.usersRepository.save(admin);
  }
}
