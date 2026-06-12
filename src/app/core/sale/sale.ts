import { Injectable } from '@angular/core';

export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

export interface SaleRequest {
  paymentMehod: string;
  cashReceived?: number;
  items: SaleItemRequest[];
}

export interface SaleResponse {
  saleId: number;
  total: number;
  changeAmount: number;
}
