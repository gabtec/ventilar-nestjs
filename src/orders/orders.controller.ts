import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAuthUser } from 'src/auth/decorators/get-auth-user.decorator';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrdersService } from './orders.service';

// @UseGuards(AuthGuard())
@UseGuards(AccessTokenGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/:id')
  async getOrderById(@Param('id') id: string) {
    return await this.ordersService.getOrderById(parseInt(id, 10));
  }

  @Get('/') // Query: ?src=wardId or dest=wardId
  async getOrdersByWard(@Query() query: any) {
    const { src = null, dest = null, is_closed: isClosed = false } = query;

    if (src && dest) {
      throw new BadRequestException(
        'You can NOT query by source and destination. Choose one.',
      );
    }
    if (src) {
      return await this.ordersService.getOrdersBySourceWard(
        parseInt(src, 10),
        isClosed,
      );
    }

    if (dest) {
      return await this.ordersService.getOrdersByDestinationWard(
        parseInt(dest, 10),
        isClosed,
      );
    }
  }

  @Post('/')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetAuthUser() user: User,
  ) {
    /**
     * When a order is created, automatically the status is "PENDING", and 'dispatched_by' is null
     */
    return await this.ordersService.create(createOrderDto, user);
  }

  @Put('/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(parseInt(id, 10), updateOrderDto);
  }

  @Patch('/:id')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetAuthUser() user: User,
  ) {
    return await this.ordersService.updateOrderStatus(
      parseInt(id, 10),
      updateOrderDto,
      user,
    );
  }
}
