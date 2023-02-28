import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { VentilatorsService } from 'src/ventilators/ventilators.service';
import { Ward } from 'src/wards/entities/ward.entity';
import { WardsService } from 'src/wards/wards.service';
import { Not, Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    private readonly wardsService: WardsService,
    private readonly ventilatorsService: VentilatorsService,
  ) {}

  async getOrdersBySourceWard(id: number) {
    return this.ordersRepo.find({
      relations: ['ventilator', 'to', 'from', 'requested_by', 'dispatched_by'],
      where: { from: { id }, is_closed: false },
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

  async getOrdersByDestinationWard(id: number) {
    return this.ordersRepo.find({
      relations: ['ventilator', 'to', 'from', 'requested_by', 'dispatched_by'],
      where: { to: { id: id }, is_closed: false },
    });
  }

  async getOrderById(id: number) {
    const order = await this.ordersRepo.findOneBy({ id });

    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto, user: User) {
    console.log(createOrderDto);
    // check to_id is_park
    try {
      await this.checkDestinationWardIsPark(createOrderDto.to_id);
    } catch (error) {
      throw error;
    }
    try {
      if (createOrderDto.ventilator_id) {
        const isUnique = await this.checkRepetedOrders(
          createOrderDto.ventilator_id,
        );
        if (!isUnique) {
          throw new ConflictException('This ventilator has an active order.');
        }
      }
      const destPark: Ward = await this.wardsService.getWardById(
        createOrderDto.to_id,
      );

      const newOrder = {
        ...createOrderDto,
        to: destPark,
        from: user.workplace,
        created_by: user,
        updated_by: user,
      };

      const order = this.ordersRepo.save(newOrder);
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    try {
      const res = await this.ordersRepo.update({ id: orderId }, updateOrderDto);
      return res;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // async updateOrderStatus(orderID, user: User, status: any, obs: string) {
  async updateOrderStatus(
    orderID: number,
    updateOrderDto: UpdateOrderDto,
    user: User,
  ) {
    const prevOrder = await this.ordersRepo.findOne({
      relations: ['ventilator'],
      where: { id: orderID },
    });

    if (!prevOrder) {
      throw new NotFoundException('Cannot find the order to update');
    }

    const newOrder = { ...prevOrder };
    // UC 1 - is PENDING and dispatcher dispatches
    // UC 1.1 - set selected ventilator to id_free=false
    // UC 1.2 - set selected order status=DISPATCHED & dispatched_by = user from token
    if (updateOrderDto.action === 'DISPATCH') {
      const ventID = parseInt(updateOrderDto.ventilator_id, 10);
      const ventilator = await this.ventilatorsService.getVentilatorById(
        ventID,
      );

      newOrder.status = 'DISPATCHED';
      newOrder.dispatched_by = user;
      newOrder.obs = prevOrder.obs.concat('\n', updateOrderDto.obs);
      ventilator.is_free = false;
      newOrder.ventilator = ventilator;
    }

    if (updateOrderDto.action === 'RETURN') {
      newOrder.status = 'RETURNED';
      newOrder.delivered_by = user;
      newOrder.obs = prevOrder.obs.concat('\n', updateOrderDto.obs);
    }

    if (updateOrderDto.action === 'RECEIVE') {
      newOrder.status = 'CLOSED';
      newOrder.is_closed = true;
      newOrder.received_by = user;
      newOrder.obs = prevOrder.obs.concat('\n', updateOrderDto.obs);

      const ventilator = await this.ventilatorsService.getVentilatorById(
        prevOrder.ventilator.id,
      );

      ventilator.is_free = true;
      newOrder.ventilator = ventilator;
    }

    try {
      const res = await this.ordersRepo.save(newOrder);
      return res;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async checkRepetedOrders(ventID: number) {
    if (ventID === 0) return true;
    // if a vent as an open order (status != closed), new order must be rejected
    const vent = this.ordersRepo.findOne({
      relations: ['ventilator'],
      where: {
        ventilator: {
          id: ventID,
        },
        status: Not('CLOSED'),
      },
    });

    if (!vent) {
      return true;
    }

    return false;
  }

  async checkDestinationWardIsPark(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('id to check must be a number');
    }

    const ward = await this.wardsService.getWardById(id);
    if (!ward.is_park) {
      throw new BadRequestException(
        'The destination ward must be a park of ventilators',
      );
    }

    return true;
  }
}
