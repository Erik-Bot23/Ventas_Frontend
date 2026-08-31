import { Injectable } from '@angular/core';
import { PaymentMethod } from '../../enums/paymentMethod';
import { CardPaymentRequest, CardPaymentResponse } from '../payment/payment';

//Interface con atributos que se usarán en la interface SaleRequest
export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

//Interface para ventas que se usará en sale-service
export interface SaleRequest {
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  items: SaleItemRequest[]; //Un arreglo con los atributos de la interface SaleItemRequest
  cardPayment?: CardPaymentRequest; //Para pagos con tarjetas
}

//Interface para ventas que se usará en sale-service
export interface SaleResponse {
  saleId: number;
  total: number;
  paymentMethod: PaymentMethod;
  changeAmount: number | null;
  cashReceived: number | null;
  paymentStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  cardPaymentResponse?: CardPaymentResponse; 
}

//Interface para el historial de la venta
export interface SaleHistory {
  id: number;
  saleDate: string;
  total: number;
  paymentMethod: PaymentMethod;
  cashReceived: number | null;
  changeAmount: number | null;
}
