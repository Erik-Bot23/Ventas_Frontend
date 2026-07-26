import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse } from '../login/login';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })

//Esta clase es para el LOGIN en features/login/login.ts
export class AuthService {
  //La ruta a la que va a responder en el backend
  private api = `${environment.api}/auth`;
  //private api = 'http://localhost:8081/api/auth';
  
  constructor(private http: HttpClient){}

  //Validar usuario y mandar a la página inicial
  login(data: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.api}/login`, data);
  }

  //Guardar el token
  saveToken(token: string): void{
    localStorage.setItem('token', token);
  }

  //Obtener el token
  getToken(): string | null{
    return localStorage.getItem('token');
  }

  //Guardar el usuario
  saveUser(user: LoginResponse): void{
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }));
  }

  //Obtener el usuario
  getUser(){
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  //Obtener el nombre
  getUsername(): string{
    return this.getUser()?.name ?? '';
  }

  //Obtener el rol
  getRole(): string{
    return this.getUser()?.role ?? '';
  }

  //Saber si inicio sesión
  isLogged(): boolean{
    return !!this.getToken();
  }

  //Cerrar sesión
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  //Recuperar contraseña si se olvido
  forgotPassword(email: string){
    return this.http.post(`${this.api}/forgot-password`, {email});
  }

  //Borrar la contraseña actual
  resetPassword(token: string, newPassword: string){
    return this.http.post(`${this.api}/reset-password`, {token, newPassword});
  }

  //Cambiar la contraseña desde perfil
  changePassword(currentPassword: string, newPassword: string){
    return this.http.post(`${this.api}/change-password`, {currentPassword, newPassword});
  }

}
