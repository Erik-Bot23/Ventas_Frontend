import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { CashFacade } from './facade/cash-facade';
import { SaleFacade } from './facade/sale-facade';


@Component({
  selector: 'app-cobro',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './cobro.html',
  styleUrl: './cobro.css',
})

export class Cobro implements OnInit {

  constructor(
    public cash: CashFacade,
    public sale: SaleFacade
  ) {}

  ngOnInit(): void {
    this.cash.initialize();
    this.sale.initialize();
  }
}
