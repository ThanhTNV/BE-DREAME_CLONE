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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentService } from 'src/payment/payment.service';
import { OrderType } from 'src/payment/OrderType';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('all')
  async findAll() {
    return await this.orderService.getAllOrders();
  }

  @Post('create')
  async create(
    @Body()
    {
      order,
      language,
    }: {
      order: { orderCreate: CreateOrderDto; orderDetails: OrderDetail[] };
      language: string;
    },
    @Param()
    {
      bankCode,
      orderInfo,
      orderType = OrderType,
    }: { bankCode: string; orderInfo: string; orderType: number },
    @Headers('x-forwarded-for') ipAddr: string,
  ) {
    const orderCreated = await this.orderService.createOrder(
      order.orderCreate,
      order.orderDetails,
    );
    return orderCreated;

    // console.log(orderType); //

    // return await this.paymentService.createPayment(
    //   { orderCreated, language },
    //   { bankCode, orderInfo, orderType },
    //   ipAddr,
    // );
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
