import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { OrderDetailSchema } from './schemas/order-detail.schema';
import { ProductModule } from 'src/product/product.module';
import { PaymentModule } from 'src/payment/payment.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderDetail', schema: OrderDetailSchema },
    ]),
    ProductModule,
    PaymentModule,
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
