import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse } from '../login/login';

@Injectable({ providedIn: 'root' })

//Esta clase es para el LOGIN en features/login/login.ts
export class AuthService {
  //La ruta a la que va a responder en el backend
  private api = 'http://localhost:8081/api/auth';
  constructor(private http: HttpClient){}

  //Validar usuario y mandar a la página inicial
  login(data: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.api}/login`, data);
  }
}
