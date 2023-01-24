import { Controller, Get, Param } from '@nestjs/common';
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
}
