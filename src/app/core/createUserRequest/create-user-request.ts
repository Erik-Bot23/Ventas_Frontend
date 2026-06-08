import { Injectable } from '@angular/core';


export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}
