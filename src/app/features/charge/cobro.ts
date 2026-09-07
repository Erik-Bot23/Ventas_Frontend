import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { CashFacade } from './facade/cash-facade';
import { SaleFacade } from './facade/sale-facade';
import { HasPermissionDirectives } from '../../core/routes/directives/has-permission-directives';
import { AuthService } from '../../core/service/auth-service/auth-service';


@Component({
  selector: 'app-cobro',
  imports: [CommonModule, FormsModule, Sidebar, HasPermissionDirectives],
  templateUrl: './cobro.html',
  styleUrl: './cobro.css',
})

export class Cobro implements OnInit {

  constructor(
    public cash: CashFacade,
    public sale: SaleFacade,
    public auth: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cash.initialize();
    this.sale.initialize();
  }
}