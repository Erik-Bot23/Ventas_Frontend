import { Injectable } from '@angular/core';

//Interface con atributos que se usarán en la interface SaleRequest
export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

//Interface para ventas que se usará en sale-service
export interface SaleRequest {
  paymentMethod: string;
  cashReceived?: number;
  items: SaleItemRequest[]; //Un arreglo con los atributos de la interface SaleItemRequest
}

//Interface para ventas que se usará en sale-service
export interface SaleResponse {
  saleId: number;
  total: number;
  changeAmount: number;
  cashReceived: number;
}

//Interface para el historial de la venta
export interface SaleHistory {
  id: number;
  saleDate: string;
  total: number;
  paymentMethod: string;
  cashReceived: number;
  changeAmount: number;
}
