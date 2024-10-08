import { IsNotEmpty } from 'class-validator';
import { CustomerInfoDto } from './customerInfo.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  customerInfo: CustomerInfoDto;
}
