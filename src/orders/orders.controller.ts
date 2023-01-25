import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard())
  @Get('/:wardID')
  async getOrdersByWard(@Param('wardID') id: string) {
    return this.ordersService.getOrdersByWard(parseInt(id, 10));
  }
}
