import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Servicio compartido del sidebar
import { SidebarService } from '../../core/service/sidebar-service/sidebar-service';

@Component({
  selector: 'app-caja',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './caja.html',
  styleUrl: './caja.css',
})
export class Caja {
  // ANTES: menuOpen = false y toggleMenu() aqui.
  // AHORA: todo maneja el SidebarService
  constructor(public sidebar: SidebarService){}
}
