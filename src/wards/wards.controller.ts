import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
}
