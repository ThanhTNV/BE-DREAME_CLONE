import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { ProductService } from 'src/product/product.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('OrderDetail')
    private readonly orderDetailModel: Model<OrderDetail>,
    private readonly productService: ProductService,
  ) {}

  async getAllOrders() {
    const orders = await this.orderModel.find().exec();
    return orders;
  }

  async createOrder(order: CreateOrderDto, orderDetails: OrderDetail[]) {
    // Create order
    const newOrder: Order = {
      id: new Date().toISOString(),
      total: 0,
      ...order,
      status: true,
    };
    const products = await this.productService.findMany(
      orderDetails.map((od) => od.productId),
    );
    if (products.length !== orderDetails.length) {
      throw new NotFoundException('Product not found');
    }
    this.createOrderDetails(newOrder, orderDetails, products);

    newOrder.total = products.reduce((total, product) => {
      const orderDetail = orderDetails.find(
        (od) => od.productId === product.id,
      );
      return total + product.price * orderDetail.quantity;
    }, 0);

    const createdOrder = new this.orderModel(newOrder);
    await createdOrder.save();

    return newOrder;
  }

  async getOrder(orderId: string) {
    const order = await this.orderModel.findOne({ id: orderId }).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const orderDetails = await this.orderDetailModel
      .find({ orderId: orderId })
      .exec();
    console.log(order);

    return {
      ...order.toJSON(),
      orderDetails: orderDetails,
    };
  }

  async getOrderWithoutDetails(orderId: string): Promise<Order> {
    const order = await this.orderModel.findOne({ id: orderId }).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const { id, total, status, customerInfo } = order.toJSON();
    return { id, total, status, customerInfo };
  }

  async updateOrder(orderId: string, { order, orderDetails }: UpdateOrderDto) {
    const _order = await this.orderModel.findOne({ id: orderId }).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderModel.updateOne({ id: _order.id }, order).exec();

    if (orderDetails) {
      orderDetails.forEach(async (orderDetail) => {
        await this.updateOrderDetail(orderDetail);
      });
    }
    return {
      message: 'Order has been updated',
    };
  }

  private async updateOrderDetail(orderDetail: OrderDetail) {
    const _orderDetail = await this.orderDetailModel
      .findOne({
        orderId: orderDetail.orderId,
        productId: orderDetail.productId,
      })
      .exec();
    if (!_orderDetail) {
      throw new NotFoundException('Order detail not found');
    }

    await this.orderDetailModel.updateOne({ id: _orderDetail.id }, orderDetail);
  }

  async removeOrder() {
    throw new HttpException(
      'Method not implemented.',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  async removeAll() {
    const orders = await this.orderModel.find().exec();
    orders.forEach(async (order) => {
      await this.orderModel.findByIdAndDelete(order._id);
    });

    const orderDetails = await this.orderDetailModel.find().exec();
    orderDetails.forEach(async (orderDetail) => {
      await this.orderDetailModel.findByIdAndDelete(orderDetail._id);
    });
    return {
      message: 'All orders have been removed',
    };
  }

  private createOrderDetails(
    order: Order,
    orderDetails: OrderDetail[],
    products: Product[],
  ) {
    orderDetails.forEach((orderDetail) => {
      const product = products.find((p) => p.id === orderDetail.productId);
      if (product.amount < orderDetail.quantity) {
        throw new BadRequestException('Not enough product');
      }
    });
    orderDetails.forEach(async (orderDetail) => {
      const product = products.find((p) => p.id === orderDetail.productId);
      await this.createOrderDetail(order, orderDetail, product);
    });
  }

  private async createOrderDetail(
    order: Order,
    orderDetail: OrderDetail,
    product: Product,
  ) {
    const amount = await this.isAvailable(product, orderDetail.quantity);
    await this.productService.update(product.id, { amount });
    await new this.orderDetailModel({
      ...orderDetail,
      orderId: order.id,
    }).save();
  }

  private async isAvailable(product: Product, quantity: number) {
    const newAmount = product.amount - quantity;
    product.amount = newAmount;
    const { amount } = product;
    return amount;
  }
}
