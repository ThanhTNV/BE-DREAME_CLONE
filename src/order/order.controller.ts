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
  UseGuards,
  ValidationPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDetail } from './entities/order-detail.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentService } from 'src/payment/payment.service';
import { OrderType } from 'src/payment/OrderType';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { OrderDto } from './dto/order.dto';

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

  @Post()
  @ApiBody({
    type: Object,
    required: true,
    description: 'Order create data and order details',
  })
  @ApiHeader({
    name: 'x-api-key',
    required: true,
    description: 'API key',
  })
  @UseGuards(AuthGuard('api-key'))
  async create(
    @Body('orderCreate', new ValidationPipe({ transform: true }))
    orderCreate: CreateOrderDto,
    @Body('orderDetails', new ParseArrayPipe())
    orderDetails: OrderDetail[],
  ) {
    const orderCreated = await this.orderService.createOrder(
      orderCreate,
      orderDetails,
    );
    return orderCreated;

    // console.log(orderType); //

    //
  }

  @Get('payment/:orderId')
  @ApiQuery({
    name: 'bankCode',
    required: false,
    type: String,
    description: 'Bank code',
  })
  @ApiQuery({
    name: 'orderInfo',
    required: false,
    type: String,
    description: 'Order info',
  })
  @ApiQuery({
    name: 'orderType',
    required: false,
    type: String,
    description: 'Order type',
  })
  async createVnPayment(
    @Param('orderId') orderId: string,
    @Query(new ValidationPipe({ transform: true }))
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
    return new NotImplementedException();
    const language = 'vn';
    bankCode = bankCode != '0' ? bankCode : '';
    orderInfo = orderInfo != '0' ? orderInfo : '';
    orderType = orderType != '0' ? orderType : 'topup';

    const orderCreated =
      await this.orderService.getOrderWithoutDetails(orderId);

    const redirectURL = await this.paymentService.createPayment(
      { orderCreated, language },
      { bankCode, orderInfo, orderType },
      ipAddr,
    );
    return res.redirect(redirectURL);
  }

  @Delete('remove-all')
  @UseGuards(AuthGuard('api-key'))
  async removeAllOrders() {
    return await this.orderService.removeAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.getOrder(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('api-key'))
  async update(
    @Param('id') id: string,
    @Body('order', new ValidationPipe({ transform: true })) order: OrderDto,
    @Body('orderDetails', new ParseArrayPipe()) orderDetails: OrderDetail[],
  ) {
    return await this.orderService.updateOrder(id, { order, orderDetails });
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
