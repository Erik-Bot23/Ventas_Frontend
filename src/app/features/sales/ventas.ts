import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
// Servicio compartido del sidebar
import { SidebarService } from '../../core/service/sidebar-service/sidebar-service';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas {
  constructor(public sidebar: SidebarService){}
}
