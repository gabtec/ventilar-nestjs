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
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateVentilatorDto } from './dtos/create-ventilator.dto';
import { VentilatorsService } from './ventilators.service';

// @UseGuards(AuthGuard())
@UseGuards(AccessTokenGuard)
@ApiTags('Ventiladors')
@Controller('ventilators')
export class VentilatorsController {
  constructor(private readonly ventsService: VentilatorsService) {}

  @Post('/')
  async create(@Body() createVentDto: CreateVentilatorDto) {
    return await this.ventsService.create(createVentDto);
  }

  @Get('/:id')
  async getVentilatorById(@Param('id') id: string) {
    return await this.ventsService.getVentilatorById(parseInt(id, 10));
  }

  @Get('/') // always returns ventilators with 'is_free'=true
  async getVentilatorsAndCountByWardAndCat(
    @Query() query: { cat?: 'VI' | 'VNI' },
    // @Query() query: { parkId?: string; status?: boolean; cat?: 'VI' | 'VNI' },
  ) {
    // if (query.parkId) {
    //   return await this.ventsService.getVentilatorsByPark(
    //     parseInt(query.parkId, 10),
    //   );
    // }
    // if (query.cat && query.status) {
    //   return await this.ventsService.getVentilatorsByStatus(
    //     query.cat,
    //     query.status,
    //   );
    // }
    if (query?.cat) {
      return await this.ventsService.getVentilatorsAndCountByWardAndCat(
        query.cat,
      );
    }

    throw new BadRequestException('Could not understand query!');
  }
}
