import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  menuOpen = false;

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }
}
