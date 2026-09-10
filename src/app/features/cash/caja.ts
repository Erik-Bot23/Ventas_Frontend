import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-caja',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './caja.html',
  styleUrl: './caja.css',
})
export class Caja {
  menuOpen = false;

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }
}
