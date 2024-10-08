import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsJSON,
  isNotEmptyObject,
} from 'class-validator';
import { OrderDetailDto } from './orderDetail.dto';
import { CustomerInfoDto } from './customerInfo.dto';
import { OrderDto } from './order.dto';

export class UpdateOrderDto {
  @IsNotEmpty()
  order: OrderDto;
  
  @IsArray()
  @IsNotEmpty()
  orderDetails?: OrderDetailDto[];
}
