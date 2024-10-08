import { IsNotEmpty } from "class-validator";
import { CustomerInfoDto } from "./customerInfo.dto";

export class OrderDto {
  @IsNotEmpty()  
  customerInfo: CustomerInfoDto;
  total?: number;
  status?: boolean;
}
