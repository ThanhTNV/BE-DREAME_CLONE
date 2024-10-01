export class UpdateOrderDto {
  order: {
    customerInfo?: {
      name?: string;
      address: string;
      phone?: string;
      email?: string;
    };
    total?: number;
    status?: boolean;
  };
  orderDetails?: {
    productId: string;
    quantity: number;
  }[];
}