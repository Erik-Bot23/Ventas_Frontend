import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes {
  //Desplegar menú
  menuOpen = false;

  //Abrir y cerrar el menú
  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }
}
