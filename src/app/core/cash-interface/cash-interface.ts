import { Injectable } from '@angular/core';

export interface CashRegister {
  id: number;
  openedAt: string;
  closedAt: string;
  openingAmount: number;
  closingAmount: number;
  active: boolean;
}

export interface CashSummary{
  cashId: number;
  openingAmount: number;
  cashSales: number;
  debitSales: number;
  creditSales: number;
  totalSales: number;
  expectedAmount: number;
  totalTickets: number;
  difference: number;
}

export interface OpenCashRequest{
  openingAmount: number;
}

export interface ClosingCashRequest{
  closingAmount: number;
}
