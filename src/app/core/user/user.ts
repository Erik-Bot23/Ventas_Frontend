import { Injectable } from '@angular/core';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  active?: boolean;
}
