import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Servicio compartido del sidebar
import { SidebarService } from '../../core/service/sidebar-service/sidebar-service';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  constructor(public sidebar: SidebarService){}
}
