import { Injectable } from '@angular/core';

//Interface con sus atributos que se usarán en product-service
export interface Product{
  id?: number;
  name: string;
  description?: string;
  price: number;
  cost?: number; //útil para reportes
  stock: number;
  sku?: string; //código del producto
  barcode?: string;
  img?: string;
  categoryId: number;
  categoryName?: string;
  active?: boolean;
  createdAt?: Date;
}
