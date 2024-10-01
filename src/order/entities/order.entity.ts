export interface Order {
  id: string;
  customerInfo: {
    name: String;
    address: String;
    phone: String;
    email: String;
  };
  total: number;
  status: boolean;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}
