import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { CryptoService } from 'src/auth/crypto.service';
import { ChangePasswordDto } from 'src/auth/dtos/change-password.dto';
import { Ward } from 'src/wards/entities/ward.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  // @InjectRepository(Ward)
  // private readonly wardsRepository: Repository<Ward>,
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAll() {
    const users = await this.usersRepository.find();

    return users.map((user) => this.parseUser(JSON.stringify(user)));
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return this.parseUser(JSON.stringify(user));
  }

  async getUserByMec(mec: number) {
    const user = await this.usersRepository.findOneBy({
      mec: mec,
    });

    if (!user) {
      throw new NotFoundException();
    }

    // must return with passwordHash
    return JSON.stringify(user);
  }

  async getUsersByWard(id: number) {
    const users = await this.usersRepository.find({
      where: {
        workplace_id: id,
      },
    });
    return users.map((user) => this.parseUser(JSON.stringify(user)));
  }

  async create(userDto: CreateUserDto) {
    if (userDto.password !== userDto.password_confirm) {
      throw new BadRequestException('Passwords do NOT match!');
    }

    // const hash = await this.cryptoService.hashPassword(userDto.password);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userDto.password, salt);

    // Must pre-exist the ward with id=1
    const user = this.usersRepository.create({
      name: userDto.name,
      mec: userDto.mec,
      role: userDto.role,
      workplace_id: userDto.workplace_id,
      // workplace: await this.wardsRepository.findOneBy({
      //   id: userDto.workplace_id,
      // }),
      password_hash: hash,
    });

    try {
      const newUser = await this.usersRepository.save(user);
      // NOTE: it won't include ward object inside newUser

      return this.parseUser(JSON.stringify(newUser));
    } catch (error) {
      if (error.message.includes('violates unique constraint')) {
        throw new ConflictException(error.message);
      }
      console.error(error.message);
      console.error(error);
      throw new Error('Could NOT create the user!');
    }
  }

  async changePassword(userId: number, changePasswDto: ChangePasswordDto) {
    if (changePasswDto.password !== changePasswDto.password_confirm) {
      throw new BadRequestException('Passwords do NOT match!');
    }

    // const hash = await this.cryptoService.hashPassword(changePasswDto.password);

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(changePasswDto.password, salt);

    return await this.usersRepository.update(userId, {
      password_hash: hash,
    });
  }

  async register(userDto: RegisterUserDto) {
    const usersCount = await this.usersRepository.count();

    if (usersCount > 0) {
      throw new NotFoundException('Route Not Found!');
    }

    // const hash = await this.cryptoService.hashPassword(userDto.password);

    // // Must pre-exist the ward with id=1
    // const admin = this.usersRepository.create({
    //   name: userDto.name,
    //   mec: 9999,
    //   role: 'admin',
    //   // workplaceId: 1,
    //   workplace_id: 1,
    //   workplace: await this.wardsRepository.create({ id: 1 }),
    //   password_hash: hash,
    // });

    // const user = this.usersRepository.save(admin);
    // return this.parseUser(JSON.stringify(user));
    return this.create({
      name: userDto.name,
      mec: 9999,
      role: 'admin',
      workplace_id: 1, // IT_Service
      password: userDto.password,
      password_confirm: userDto.password,
    });
  }

  parseUser(userJson: string) {
    const user = JSON.parse(userJson);
    return {
      id: user.id,
      mec: user.mec,
      name: user.name,
      role: user.role,
      workplace: user.workplace?.name || user.workplace_id,
    };
  }
}
