import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
  ) {}

  async getOrdersBySourceWard(id: number, isActive: boolean) {
    return this.ordersRepo.find({
      where: { from_id: id, is_active: isActive },
    });
    // return (
    //   this.ordersRepo
    //     .createQueryBuilder('order')
    //     .leftJoinAndSelect('order.ward', 'park', 'from_id = :wardID', {
    //       wardID: id,
    //     })
    //     // .leftJoinAndSelect('order.ventilator', 'park')
    //     // .where('from_id = :wardID', { wardID: id })
    //     // .getMany()
    //     .printSql()
    // );
  }

  async getOrdersByDestinationWard(id: number, isActive: boolean) {
    return this.ordersRepo.find({
      where: { to_id: id, is_active: isActive },
    });
  }

  async getOrderById(id: number) {
    const order = await this.ordersRepo.findOneBy({ id });

    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = this.ordersRepo.save(createOrderDto);
      return order;
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    if (updateOrderDto.status === 'CLOSED') {
      updateOrderDto.is_active = false;
    }

    if (updateOrderDto.status && updateOrderDto.status !== 'CLOSED') {
      updateOrderDto.is_active = true;
    }

    if (
      updateOrderDto.status === 'DISPATCHED' &&
      updateOrderDto.dispatched_by == null
    ) {
      throw new BadRequestException(
        'When changing status to "DISPATCHED", the "dispatched_by" user is REQUIRED!',
      );
    }
    try {
      const res = await this.ordersRepo.update(orderId, updateOrderDto);
      return res;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }
}
