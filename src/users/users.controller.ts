import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getAll() {
    return await this.usersService.getAll();
  }

  @Get('/by_ward/:wardID')
  async getAllByWard(@Param('wardID') wardID: string) {
    return await this.usersService.getUsersByWard(Number(wardID));
  }

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }
}
