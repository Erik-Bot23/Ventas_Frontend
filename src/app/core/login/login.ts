import { Injectable } from '@angular/core';

//Interfaces que se usarán en auth-service
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  id: number;
  name: string;
  email: string;
  role: string;
}