import { Component } from '@angular/core';
import { NgForOf } from "../../../../node_modules/@angular/common/types/_common_module-chunk";
import { SaleHistory } from '../../core/interfaces/sale/sale';

@Component({
  selector: 'app-salehistory',
  imports: [NgForOf],
  templateUrl: './salehistory.html',
  styleUrl: './salehistory.css',
})
export class Salehistory {

  sales: SaleHistory[] = [];
}
