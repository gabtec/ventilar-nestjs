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

  async getOrdersBySourceWard(id: number, isClosed: boolean) {
    return this.ordersRepo.find({
      where: { from_id: id, is_closed: isClosed },
      relations: ['ventilator'],
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

  async getOrdersByDestinationWard(id: number, isClosed: boolean) {
    return this.ordersRepo.find({
      where: { to_id: id, is_closed: isClosed },
      relations: ['ventilator'],
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
      const order = this.ordersRepo.save({
        ...createOrderDto,
        from_id: user.workplace_id,
        created_by: `(${user.mec}) ${user.name}`,
        updated_by: `(${user.mec}) ${user.name}`,
      });
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    if (updateOrderDto.status === 'CLOSED') {
      updateOrderDto.is_closed = true;
    }

    if (updateOrderDto.status && updateOrderDto.status !== 'CLOSED') {
      updateOrderDto.is_closed = false;
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
      const res = await this.ordersRepo.update(orderId, {
        ...updateOrderDto,
        ventilator_id: parseInt(updateOrderDto.ventilator_id, 10),
      });
      return res;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // async updateOrderStatus(orderID, user: User, status: any, obs: string) {
  async updateOrderStatus(orderID, updateOrderDto: UpdateOrderDto, user: User) {
    const prevOrder = await this.ordersRepo.findOneBy({ id: orderID });
    const ventID = parseInt(updateOrderDto.ventilator_id, 10);
    const ventilator = await this.ventilatorsService.getVentilatorById(ventID);

    if (!prevOrder) {
      throw new NotFoundException('Cannot find the order to update');
    }

    const newOrder = { ...prevOrder };
    newOrder.obs = prevOrder.obs + '\n' + updateOrderDto.obs;
    newOrder.status = updateOrderDto.status;
    newOrder.is_closed = updateOrderDto.status === 'CLOSED' ? true : false;

    newOrder.updated_by = `(${user.mec}) ${user.name}`;
    newOrder.dispatched_by =
      user.role === 'dispatcher' ? `(${user.mec}) ${user.name}` : null;
    // newOrder.ventilator_id = updateOrderDto.ventilator_id || null;
    if (updateOrderDto.ventilator_id && user.role === 'dispatcher') {
      ventilator.is_available = false;
    }

    if (updateOrderDto.status === 'CLOSED' && user.role === 'dispatcher') {
      ventilator.is_available = true;
    }
    newOrder.ventilator = ventilator;

    try {
      await this.ventilatorsService.updateStatus(
        ventID,
        ventilator.is_available,
      );
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
      where: {
        ventilator_id: ventID,
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
