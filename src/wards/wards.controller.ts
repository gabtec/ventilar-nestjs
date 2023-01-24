import { Controller, Get } from '@nestjs/common';
import { WardsService } from './wards.service';

@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get('/')
  async getAll() {
    return await this.wardsService.getAll();
  }
}
