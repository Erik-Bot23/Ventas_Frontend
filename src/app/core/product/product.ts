import { Injectable } from '@angular/core';

export interface ProductForm{
  id?: number;
  name: string;
  price: number;
  stock: number;
  img?: string;
  categoryId: number;
  categoryName?: string;
  active?: boolean;
  createdAt?: Date;
}

export interface ProductShow{
  id?: number;
  name: string;
  description?: string;
  price: number;
  cost?: number; //útil para reportes
  stock: number;
  sku?: string; //código del producto
  barcode?: string;
  categoryId: number;
  categoryName: string;
  active?: boolean;
  createdAt?: Date;
}

export interface ProductSale{
  id: number;
  name: string;
  price: number;
  stock: number;
  barcode?: string;
}

export interface Category {
  id: number;
  name: string;
}
