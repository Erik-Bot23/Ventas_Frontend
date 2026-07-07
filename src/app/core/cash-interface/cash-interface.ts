import { Injectable } from '@angular/core';

export interface CashRegister {
  id: number;
  openedAt: string;
  closedAt: string;
  openingAmount: number;
  closingAmount: number;
  active: boolean;
}

export interface OpenCashRequest{
  openingAmount: number;
}

export interface ClosingCashRequest{
  closingAmount: number;
}
