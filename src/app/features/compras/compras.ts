import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compras',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras {
  //Desplegar menú
  menuOpen = false;

  //Abrir y cerrar el menú
  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }
}
