import { Injectable } from '@angular/core';

//Interface para crear el usuario
//Se usará en features/cobro/cobro.ts
export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  roleId: number;
  roleName?: string;
  active?: boolean;
}

//Interface para ver el role del usuario
//Se usará en features/cobro/cobro.ts
export interface UserRole {
  id: number;
  name: string;
}

//Interface para crear un usuario
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

//Interface para actualizar un usuario
export interface UpdateUserRequest {
  name: string;
  email: string;
  roleId: number;
}