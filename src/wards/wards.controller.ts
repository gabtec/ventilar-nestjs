import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowRoles } from 'src/auth/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateWardDto } from './dtos/create-ward.dto';
import { WardsService } from './wards.service';

// @UseGuards(AuthGuard())
@UseGuards(AccessTokenGuard)
@ApiTags('Wards')
@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  // ================= Handlers ======================

  // ================= Handlers ==================POST
  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'The resources was successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request data.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Verify unique value fields',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(RolesGuard)
  @AllowRoles('admin')
  async createWard(@Body() createWardDto: CreateWardDto) {
    return this.wardsService.create(createWardDto);
  }

  // ================= Handlers ===================GET
  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'The resources were successfully fetched.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getAll() {
    return await this.wardsService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'The resources were successfully fetched.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @Get('/:id') // ================================== GET /wards/:id
  async getOneById(@Param('id') id: string) {
    return await this.wardsService.getWardById(parseInt(id, 10));
  }

  // ================= Handlers ===================GET
  @Get('/:id/ventilators')
  @ApiResponse({
    status: 200,
    description: 'The resource was successfully fetched.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getAllVentilatorsInAPark(@Param('id') parkID: string) {
    return await this.wardsService.getAllVentilatorsInAPark(
      parseInt(parkID, 10),
    );
  }
}
