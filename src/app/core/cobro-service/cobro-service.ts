import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cobro, CobroItem } from '../cobro/cobro';
import { HttpClient } from '@angular/common/http';
import { Product } from '../product/product';

@Injectable({
  providedIn: 'root',
})
export class CobroService {
  private api = 'http://localhost:8081/api/cart'

  //estado del carrito en memoria
  cart$ = new BehaviorSubject<CobroItem[]>([]);

  constructor(private http: HttpClient){}

  //Cargar todos los productos
  loadCart(){
    this.http.get<Cobro>(this.api).subscribe(cart => this.cart$.next(cart.items));
  }

  //Función para agregar productos
  add(product: Product){
    this.http.post<void>(`${this.api}/add`, product).subscribe(() => this.loadCart()); //refresca el carro
  }

  //Elimina solo un producto
  removeOne(productId: number){
    this.http.delete<void>(`${this.api}/remove/${productId}`).subscribe(() => this.loadCart());
  }

  //Traer el total de los productos
  getTotal(){
    return this.http.get<number>(`${this.api}/total`);
  }

  //Limpiar tabla de ventas
  clear(){
    this.http.delete<void>(`${this.api}/clear`).subscribe(() => this.loadCart());
  }
}
