import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleHistory, SaleRequest, SaleResponse } from '../sale/sale';
import { Observable } from 'rxjs';
import { ProductShow } from '../product/product';

@Injectable({
  providedIn: 'root',
})

//Se usará en features/cobro/cobro.ts
export class SaleService {
  private api = 'http://localhost:8081/api/sales';
  private apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient){}

  //Se procesa la venta, pero solo hasta que se realiza
  //El carro de ventas nunca de envía a la BD
  processSale(request: SaleRequest): Observable<SaleResponse>{
    return this.http.post<SaleResponse>(this.api, request);
  }
  
   //Muestra los productos en la tabla de ventas 
  //Se usará en features/cobro/cobro.ts
  getProductsVentas(){
    return this.http.get<ProductShow[]>(this.apiUrl);
  }

  //Muestra los productos en la tabla de ventas a través de código de barras
  //Se usará en features/cobro/cobro.ts
  findByBarcode(barcode: string){
    return this.http.get<ProductShow>(`${this.apiUrl}/barcode/${barcode}`);
  }

  searchProducts(term: string){
    return this.http.get<ProductShow[]>(`${this.apiUrl}/search?q=${term}`);
  }

  //Ver historial de las ventas
  getSales(){
    return this.http.get<SaleHistory[]>(this.api);
  }

}
