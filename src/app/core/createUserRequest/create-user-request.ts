import { Injectable } from '@angular/core';

//Usuarios completo
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}
