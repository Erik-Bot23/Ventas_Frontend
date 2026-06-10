import { Injectable } from '@angular/core';

//Interface con sus atributos que se hará uso en auth
export interface LoginResponse {
  success: boolean;
  id: number;
  name: string;
  email: string;
  role: string;
}
