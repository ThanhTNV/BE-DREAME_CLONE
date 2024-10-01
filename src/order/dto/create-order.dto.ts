export class CreateOrderDto {
  customerInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}