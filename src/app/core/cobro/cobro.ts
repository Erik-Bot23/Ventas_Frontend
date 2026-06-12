import { Injectable } from '@angular/core';
import { Product } from '../product/product';

//Interface con atributos
export interface CobroItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

//Interface donde se utilizan los atributos
export interface Cobro {
  items: CobroItem[];
}
