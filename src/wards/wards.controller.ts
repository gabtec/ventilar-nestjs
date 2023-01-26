import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateWardDto } from './dtos/create-ward.dto';
import { WardsService } from './wards.service';

@UseGuards(AuthGuard())
@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get('/')
  async getAll() {
    return await this.wardsService.getAll();
  }

  @Get('/:id/ventilators')
  async getAllVentilatorsInAPark(@Param('id') parkID: string) {
    return await this.wardsService.getAllVentilatorsInAPark(
      parseInt(parkID, 10),
    );
  }

  @Post('/')
  async createWard(@Body() createWardDto: CreateWardDto) {
    return this.wardsService.create(createWardDto);
  }
}
