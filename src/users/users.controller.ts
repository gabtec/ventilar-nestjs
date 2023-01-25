import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(parseInt(id, 10));
  }

  @Get('/mec/:mec')
  async getUserByMec(@Param('mec') mec: string) {
    return await this.usersService.getUserByMec(parseInt(mec, 10));
  }

  @Get('/by_ward/:wardID')
  @HttpCode(HttpStatus.OK)
  async getAllByWard(@Param('wardID') wardID: string) {
    return await this.usersService.getUsersByWard(parseInt(wardID, 10));
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }
}
