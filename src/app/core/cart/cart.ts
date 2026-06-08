import { Injectable } from '@angular/core';
import { Product } from '../product/product';

//Interface con atributos
export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

//Interface donde se utilizan los atributos de cart
export interface Cart {
  items: CartItem[];
}
