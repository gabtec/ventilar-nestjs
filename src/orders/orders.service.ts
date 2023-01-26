import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
  ) {}

  async getOrdersByWard(id: number) {
    return this.ordersRepo.find({
      relations: ['ventilator', 'from_srv', 'to_park'],
      where: { from_id: id },
    });
  }

  // async create(createOrderDto: CreateOrderDto) {
  //   return this.ordersRepo.save();
  // }
}
