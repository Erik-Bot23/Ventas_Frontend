import { Injectable } from '@angular/core';

export interface LoginRequest {
  email: string;
  password: string;
}

//Interface con sus atributos que se hará uso en auth
export interface LoginResponse {
  success: boolean;
  id: number;
  name: string;
  email: string;
  role: string;
}