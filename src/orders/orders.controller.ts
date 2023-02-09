import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrdersService } from './orders.service';

@UseGuards(AuthGuard())
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.ordersService.getOrderById(parseInt(id, 10));
  }

  @Get('/') // Query: ?src=wardId or dest=wardId
  async getOrdersByWard(@Query() query: any) {
    const { src = null, dest = null, is_active: isActive = true } = query;

    if (src && dest) {
      throw new BadRequestException(
        'You can NOT query by source and destination. Choose one.',
      );
    }
    if (src) {
      return await this.ordersService.getOrdersBySourceWard(
        parseInt(src, 10),
        isActive,
      );
    }

    if (dest) {
      return await this.ordersService.getOrdersByDestinationWard(
        parseInt(dest, 10),
        isActive,
      );
    }
  }

  @Post('/')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    /**
     * When a order is created, automatically the status is "PENDING", and 'dispatched_by' is null
     */
    return await this.ordersService.create(createOrderDto);
  }

  @Patch('/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(parseInt(id, 10), updateOrderDto);
  }
}
