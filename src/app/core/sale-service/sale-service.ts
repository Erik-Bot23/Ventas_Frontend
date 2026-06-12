import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaleRequest, SaleResponse } from '../sale/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private api = 'http://localhost:8081/api/sales';

  constructor(private http: HttpClient){}

  processSale(request: SaleRequest): Observable<SaleResponse>{
    return this.http.post<SaleResponse>(this.api, request);
  }
  
}
