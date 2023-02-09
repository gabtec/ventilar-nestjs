import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWardDto } from './dtos/create-ward.dto';
import { WardsService } from './wards.service';

@UseGuards(AuthGuard())
@ApiTags('Wards')
@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'The resources were successfully fetched.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getAll() {
    return await this.wardsService.getAll();
  }

  @Get('/:id/ventilators')
  @ApiResponse({
    status: 200,
    description: 'The resource was successfully fetched.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllVentilatorsInAPark(@Param('id') parkID: string) {
    return await this.wardsService.getAllVentilatorsInAPark(
      parseInt(parkID, 10),
    );
  }

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'The resources was successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Bad request data.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Verify unique value fields',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createWard(@Body() createWardDto: CreateWardDto) {
    return this.wardsService.create(createWardDto);
  }
}
