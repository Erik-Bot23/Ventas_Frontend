import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../cart/cart';
import { HttpClient } from '@angular/common/http';
import { Product } from '../product/product';

@Injectable({
  providedIn: 'root',
})
export class CobroService {
  private api = 'http://localhost:8081/api/cart'

  //estado del carrito en memoria
  cart$ = new BehaviorSubject<CartItem[]>([]);

  constructor(private http: HttpClient){}

  loadCart(){
    this.http.get<Cart>(this.api).subscribe(cart => this.cart$.next(cart.items));
  }

  add(product: Product){
    this.http.post<void>(`${this.api}/add`, product).subscribe(() => this.loadCart()); //refresca el carro
  }

  removeOne(productId: string){
    this.http.delete<void>(`${this.api}/remove/${productId}`).subscribe(() => this.loadCart());
  }

  clear(){
    this.http.delete<void>(`${this.api}/clear`).subscribe(() => this.loadCart());
  }

  getTotal(){
    return this.http.get<number>(`${this.api}/total`);
  }

}
