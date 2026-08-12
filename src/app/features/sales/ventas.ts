import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas {
  //Desplegar menú
  menuOpen = false;

  //Abrir y cerrar el menú
  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }
}
