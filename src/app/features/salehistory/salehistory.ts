import { Component } from '@angular/core';
// ANTES importaba un archivo interno de node_modules (_common_module-chunk)
// que no es una API publica y rompia la compilacion de pruebas.
import { NgForOf } from '@angular/common';
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
