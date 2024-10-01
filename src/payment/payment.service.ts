import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor() {}

  async createPayment(
    { orderCreated, language }: { orderCreated: Order; language: string },
    {
      bankCode,
      orderInfo,
      orderType,
    }: { bankCode: string; orderInfo: string; orderType: number },
    ipAddr: string,
  ) {
    const date = new Date();
    // const ipAddr = req.headers['x-forwarded-for'];
    const tmnCode = process.env.vnp_TmnCode;
    const secretKey = process.env.vnp_HashSecret;
    const returnUrl = process.env.vnp_ReturnURL;

    const createDate = this.dateFormat(date, 'yyyyMMddHHmmss');
    const { total, id } = orderCreated;
    const locale = language || 'vn';
    const expireDate = this.dateFormat(
      new Date(date.getTime() + 24 * 60 * 60 * 1000),
      'yyyyMMddHHmmss',
    );
    var currCode = 'VND';
    const vnp_Params = [];
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = id;
    vnp_Params['vnp_OrderInfo'] = orderInfo || '';
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = total * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr || '127.0.0.1';
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_BankCode'] = bankCode || '';
    vnp_Params['vnp_ExpireDate'] = expireDate;

    var signData = '';
    for (const key in vnp_Params) {
      if (vnp_Params.hasOwnProperty(key)) {
        if (vnp_Params[key] !== null && vnp_Params[key] !== '') {
          signData += key + '=' + vnp_Params[key] + '&';
        }
      }
    }
    // console.log(signData);

    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    // console.log(vnp_Params);

    var vnp_NewParams = '';
    for (const key in vnp_Params) {
      if (vnp_Params.hasOwnProperty(key)) {
        if (vnp_Params[key] !== null && vnp_Params[key] !== '') {
          vnp_NewParams += key + '=' + vnp_Params[key] + '&';
        }
      }
    }
    // console.log(vnp_NewParams);

    const vnpUrl = process.env.vnp_URL + '?' + vnp_NewParams;
    console.log(vnpUrl);

    return vnpUrl;
  }

  private dateFormat(date: Date, format: string) {
    const map: any = {
      mm: date.getMonth() + 1,
      dd: date.getDate(),
      yyyy: date.getFullYear(),
      HH: date.getHours(),
      MM: date.getMinutes(),
      ss: date.getSeconds(),
    };
    return format.replace(/mm|dd|yyyy|HH|MM|ss/gi, (matched) => map[matched]);
  }
}
