import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse } from '../login/login';

@Injectable({ providedIn: 'root' })

export class AuthService {
  //La ruta a la que va a responder
  private api = 'http://localhost:8081/api/auth';
  constructor(private http: HttpClient){}

  //ESTA FUNCIÓN YA NO SE EJECUTA, ERA PARA EL KEYPAD
  validateUserId(id: string): Observable<LoginResponse>{
    //const validIds = new Set(['1234', '5678', '9999', '2026']);
    //return of(validIds.has(id)).pipe(delay(400));
    return this.http.post<LoginResponse>(`${this.api}/login`,{ id });
  }

  login(data: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.api}/login`, data);
  }
}
