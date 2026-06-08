import { Injectable } from '@angular/core';

//Interface con sus atributos que se hará uso en auth
export interface LoginResponse {
  success: boolean;
  email: string;
  role: string;
}
