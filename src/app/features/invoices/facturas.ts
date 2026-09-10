import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturas',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css',
})
export class Facturas {
  menuOpen = false;

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }
}
