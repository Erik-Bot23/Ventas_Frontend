import { Component, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
//import { PassThrough } from 'stream';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { subscribe } from 'diagnostics_channel';
import { Cart, CartItem } from '../cart/cart';
//import { CartItem } from '../cart-item/cart-item';
import { Product } from '../product/product';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private api = 'http://localhost:8081/api/cart';
  cart$ = new BehaviorSubject<CartItem[]>([]);//Investigar bien esta línea de codigo
  constructor(private http: HttpClient) {}

  //Cargar todos los prodctos
  loadCart(){
    this.http.get<Cart>(this.api).subscribe(cart => this.cart$.next(cart.items))
  }

  //Función para agregar
  add(product: Product){
    this.http.post<void>(`${this.api}/add`, product).subscribe(() => this.loadCart());
  }

  //Elimina solo una unidad
  removeOne(productId: number){
    this.http.delete<void>(`${this.api}/remove/${productId}`).subscribe(() => this.loadCart());
  }
  
  //Traer el total de productos
  getTotal(){
    return this.http.get<number>(`${this.api}/total`);
  }

  //Limpiar la tabla de productos
  clear(){
    this.http.delete<void>(`${this.api}/clear`).subscribe(() => this.loadCart());
  }

}