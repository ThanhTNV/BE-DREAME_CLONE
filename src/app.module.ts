import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from './payment/payment.module';
import { JwtAuthGuard } from './auth/jwt-auth-guard.guard';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileModule,
    ProductModule,
    OrderModule,
    MongooseModule.forRoot(
      process.env.DATABASE_URL || 'mongodb://localhost:27017/nestjs',
      {
        dbName: 'be-dreame',
      },
    ),
    PaymentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
