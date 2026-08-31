import { PaymentMethod } from "../../enums/paymentMethod";

//Request para pago con tarjeta
export interface CardPaymentRequest {
  saleId?: number;
  paymentMethod: PaymentMethod;
  pin: string;
  cardNumber: string;
}

//Response del pago con tarjeta
export interface CardPaymentResponse {
  paymentId: number;
  saleId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  authorizationCode?: string;
  message: string;
  amount: number;
  paymentDate: string;
  transactionId: string;
}
