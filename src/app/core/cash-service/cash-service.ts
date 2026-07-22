import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CashRegister } from '../cash-interface/cash-interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CashService {
  private apiUrl = `${environment.api}/cash`;
  //private apiUrl = 'http://localhost:8081/api/cash';

  constructor(private http: HttpClient){}

  getActiveCash(){
    return this.http.get<CashRegister>(`${this.apiUrl}/active`);
  }

  openCash(openingAmount: number) {
    return this.http.post<CashRegister>(`${this.apiUrl}/open`, {openingAmount});
  }  

  closeCash(closingAmount: number) {
    return this.http.post<CashRegister>(`${this.apiUrl}/close`, {closingAmount});
  }

  getSummary(){
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }
}
