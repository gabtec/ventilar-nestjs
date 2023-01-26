import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateVentilatorDto } from './dtos/create-ventilator.dto';
import { VentilatorsService } from './ventilators.service';

@UseGuards(AuthGuard())
@Controller('ventilators')
export class VentilatorsController {
  constructor(private readonly ventsService: VentilatorsService) {}

  @Get('/:id')
  async getVentilatorById(@Param('id') id: string) {
    return await this.ventsService.getVentilatorById(parseInt(id, 10));
  }

  @Get('/')
  async getVentilators(@Query('park') parkId: string) {
    if (!parkId) {
      throw new BadRequestException('Could not understand query!');
    }
    return await this.ventsService.getVentilatorsByPark(parseInt(parkId, 10));
  }

  @Post('/')
  async create(@Body() createVentDto: CreateVentilatorDto) {
    return await this.ventsService.create(createVentDto);
  }
}
