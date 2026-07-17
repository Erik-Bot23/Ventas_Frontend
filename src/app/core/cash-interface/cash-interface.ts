import { Injectable } from '@angular/core';

export interface CashRegister {
  id: number;
  openedAt: string;
  closedAt: string;
  openingAmount: number;
  closingAmount: number;
  active: boolean;
  expectedAmount: number;
  difference: number;
  cashSales: number;
  debitSales: number;
  creditSales: number;
  totalSales: number;
  totalTickets: number;
}

export interface OpenCashRequest{
  openingAmount: number;
}

export interface ClosingCashRequest{
  closingAmount: number;
}
