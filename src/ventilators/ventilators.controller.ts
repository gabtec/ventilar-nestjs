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
import { ApiTags } from '@nestjs/swagger';
import { CreateVentilatorDto } from './dtos/create-ventilator.dto';
import { VentilatorsService } from './ventilators.service';

@UseGuards(AuthGuard())
@ApiTags('Ventiladors')
@Controller('ventilators')
export class VentilatorsController {
  constructor(private readonly ventsService: VentilatorsService) {}

  @Get('/:id')
  async getVentilatorById(@Param('id') id: string) {
    return await this.ventsService.getVentilatorById(parseInt(id, 10));
  }

  @Get('/')
  async getVentilators(
    @Query() query: { parkId?: string; status?: boolean; cat?: 'VI' | 'VNI' },
  ) {
    if (query.parkId) {
      return await this.ventsService.getVentilatorsByPark(
        parseInt(query.parkId, 10),
      );
    }
    if (query.cat && query.status) {
      return await this.ventsService.getVentilatorsByStatus(
        query.cat,
        query.status,
      );
    }

    throw new BadRequestException('Could not understand query!');
  }

  @Post('/')
  async create(@Body() createVentDto: CreateVentilatorDto) {
    return await this.ventsService.create(createVentDto);
  }
}
