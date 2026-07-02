import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CashService {
  private apiUrl = 'http://localhost:8081/api/cash';

  constructor(private http: HttpClient){}

  getActiveCash(): Observable<any>{
    return this.http.get(`${this.apiUrl}/active`);
  }

  openCash(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/open`, {openingAmount: amount});
  }  

  closeCash(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/close`, {closingAmount: amount});
  }
}
