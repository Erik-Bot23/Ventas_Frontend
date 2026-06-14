import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Cobro, CobroItem } from '../cobro/cobro';
import { HttpClient } from '@angular/common/http';
import { ProductShow } from '../product/product'; 

@Injectable({
  providedIn: 'root',
})
export class CobroService {

  //estado del carrito en memoria
  cart$ = new BehaviorSubject<CobroItem[]>([]);

  constructor(){}

  //Función para agregar productos
  add(product: ProductShow){
    const current = [...this.cart$.value];

    const existing = current.find(item => item.product.id === product.id);
    
    if(existing){
      existing.quantity++;
      existing.subtotal = existing.quantity * existing.unitPrice;
    } else {
      current.push({
        product,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price
      });
    }

    this.cart$.next(current);
  }

  //Elimina solo un producto
  removeOne(productId: number){
   const current  = [...this.cart$.value];

   const item = current.find(p => p.product.id === productId);

   if(!item){
    return;
   }

   if(item.quantity > 1){
    item.quantity--;
    item.subtotal = item.quantity * item.product.price;
   }else{
    const filtered = current.filter(p => p.product.id !== productId);
    this.cart$.next(filtered);
    return;
   }
   this.cart$.next(current);
  }

  //Eliminar todos los productos de la tabla
  removeAll(productId: number){
    const filtered = this.cart$.value.filter(p => p.product.id !== productId);
    this.cart$.next(filtered);
  }

  //Traer todos los productos
  getTotalLocal(): Observable<number> {
    return this.cart$.pipe(map(items => items.reduce((sum, item) => sum + item.subtotal, 0)));
  }

  clear(){
    this.cart$.next([]);
  }
 
}
