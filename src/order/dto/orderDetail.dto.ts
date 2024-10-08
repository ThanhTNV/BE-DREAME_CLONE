import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderDetailDto {
  @IsNotEmpty()
  @IsString()
  productId: string;
  
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  quantity: number;
}
