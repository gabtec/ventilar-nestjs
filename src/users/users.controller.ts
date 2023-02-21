import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(AuthGuard())
  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getAll() {
    return await this.usersService.getAll();
  }

  // @UseGuards(AuthGuard())
  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(parseInt(id, 10));
  }

  // @UseGuards(AuthGuard())
  @UseGuards(AccessTokenGuard)
  @Get('/mec/:mec')
  async getUserByMec(@Param('mec') mec: string) {
    return await this.usersService.getUserByMec(parseInt(mec, 10));
  }

  // @UseGuards(AuthGuard())
  @UseGuards(AccessTokenGuard)
  @Get('/by_ward/:wardID')
  @HttpCode(HttpStatus.OK)
  async getAllByWard(@Param('wardID') wardID: string) {
    return await this.usersService.getUsersByWard(parseInt(wardID, 10));
  }

  // @UseGuards(AuthGuard())
  @UseGuards(AccessTokenGuard)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }
}
