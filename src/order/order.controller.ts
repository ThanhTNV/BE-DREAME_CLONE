import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Redirect,
  NotImplementedException,
  Query,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentService } from 'src/payment/payment.service';
import { OrderType } from 'src/payment/OrderType';
import { Response } from 'express';

@Controller('orders')
@ApiTags('Order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  async findAll() {
    return await this.orderService.getAllOrders();
  }

  @Post('create')
  async create(
    @Body('order')
    order: {
      orderCreate: CreateOrderDto;
      orderDetails: OrderDetail[];
    },
  ) {
    const orderCreated = await this.orderService.createOrder(
      order.orderCreate,
      order.orderDetails,
    );
    return orderCreated;

    // console.log(orderType); //

    //
  }

  @Get('payment/:orderId')
  async createVnPayment(
    @Param('orderId') orderId: string,
    @Query()
    {
      bankCode,
      orderInfo,
      orderType,
    }: {
      bankCode?: string;
      orderInfo?: string;
      orderType?: string;
    },
    @Headers('x-forwarded-for') ipAddr: string,
    @Res() res: Response,
  ) {
    const language = 'vn';
    bankCode = bankCode != '0' ? bankCode : '';
    orderInfo = orderInfo != '0' ? orderInfo : '';
    orderType = orderType != '0' ? orderType : "topup";

    const orderCreated =
      await this.orderService.getOrderWithoutDetails(orderId);

    const redirectURL = await this.paymentService.createPayment(
      { orderCreated, language },
      { bankCode, orderInfo, orderType },
      ipAddr,
    );
    return res.redirect(redirectURL);
  }

  @Get('remove-all')
  async removeAllOrders() {
    return await this.orderService.removeAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.getOrder(id);
  }

  @Post('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.updateOrder(id, updateOrderDto);
  }

  @Get('vnpay-payment')
  @Redirect()
  async vnpayPayment(
    @Headers('x-forwarded-for') ipAddr: string,
    @Param('id') id: string,
  ) {
    return new NotImplementedException();
    return 'Hello';
    // return await this.paymentService.vnpayPayment(id, ipAddr);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderService.remove(+id);
  // }
}
