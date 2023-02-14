import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { CryptoService } from 'src/auth/crypto.service';
import { ChangePasswordDto } from 'src/auth/dtos/change-password.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
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
    try {
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
        role: userDto.role || 'consumer',
        workplace_id: userDto.workplace_id || null,
        // workplace: await this.wardsRepository.findOneBy({
        //   id: userDto.workplace_id,
        // }),
        password_hash: hash,
      });

      const newUser = await this.usersRepository.save(user);
      // NOTE: it won't include ward object inside newUser

      return this.parseUser(JSON.stringify(newUser));
    } catch (error) {
      console.log(error.message);
      if (error.message.includes('violates unique constraint')) {
        throw new ConflictException(error.message);
      }

      if (error.message.includes('Illegal arguments')) {
        throw new BadRequestException(error.message);
      }
      // console.error(error.message);
      // console.error(error);
      // throw new Error('Could NOT create the user!');
      throw error;
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
    if (!this.configService.get('allowUserSelfRegistration')) {
      throw new NotFoundException('Route Not Found!');
    }

    return this.create({
      name: userDto.name,
      mec: userDto.mec || 9999,
      role: userDto.role || 'admin',
      password: userDto.password,
      password_confirm: userDto.password || userDto.password,
      workplace_id: null, // IT_Service
    });
  }

  // to use with tests
  async clearTable(id: number, runningMode: string) {
    if (runningMode !== 'test') {
      return;
    }

    // return await this.wardsRepository.clear();
    // return await this.wardsRepository.query('TRUNCATE TABLE t_wards CASCADE');
    return await this.usersRepository.delete(id);
  }

  // ----------- Helpers ----------------------
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
