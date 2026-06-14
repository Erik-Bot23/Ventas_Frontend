import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleRequest, SaleResponse } from '../sale/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

//Se usará en features/cobro/cobro.ts
export class SaleService {
  private api = 'http://localhost:8081/api/sales';

  constructor(private http: HttpClient){}

  //Se procesa la venta, pero solo hasta que se realiza
  //El carro de ventas nunca de envía a la BD
  processSale(request: SaleRequest): Observable<SaleResponse>{
    return this.http.post<SaleResponse>(this.api, request);
  }
  
}
