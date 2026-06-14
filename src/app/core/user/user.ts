import { Injectable } from '@angular/core';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  roleId: number;
  roleName?: string;
  active?: boolean;
}

export interface UserRole {
  id: number;
  role: string;
}

//Usuarios completo
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  roleId: number;
}