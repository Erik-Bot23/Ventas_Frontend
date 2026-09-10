import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Servicio compartido del sidebar
import { SidebarService } from '../../core/service/sidebar-service/sidebar-service';

@Component({
  selector: 'app-facturas',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css',
})
export class Facturas {
  constructor(public sidebar: SidebarService){}
}
