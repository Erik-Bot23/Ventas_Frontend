import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth-service/auth-service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: AuthService){}

  menuOpen = false;
  @Output() toggle = new EventEmitter<boolean>();

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
    this.toggle.emit(this.menuOpen);
    this.cd.detectChanges();
  }

  get userName(): string {
    return this.auth.getUsername();
  }

  menuItems = [
    {
      label: 'Productos',
      route: '/productos',
      permission: 'VER_PRODUCTOS'
    },
    {
      label: 'Categorías',
      route: '/categorias',
      permission: 'VER_CATEGORIAS'
    },
    {
      label: 'Caja',
      route: '/caja',
      permission: 'VER_CAJA'
    },
    {
      label: 'Usuarios',
      route: '/usuarios',
      permission: 'VER_USUARIOS'
    },
    {
      label: 'Roles',
      route: '/roles',
      permission: 'VER_ROLES'
    },
    {
      label: 'Clientes',
      route: '/clientes',
      permission: 'VER_CLIENTES'
    },
    {
      label: 'Ventas',
      route: '/ventas',
      permission: 'VER_VENTAS'
    },
    {
      label: 'Compras',
      route: '/compras',
      permission: 'VER_COMPRAS'
    },
    {
      label: 'Reportes',
      route: '/reportes',
      permission: 'VER_REPORTES'
    },
    {
      label: 'Facturas',
      route: '/facturas',
      permission: 'VER_FACTURAS'
    }
  ]

  go(route: string){
    this.router.navigate([route]);
  }

  perfil(){
    this.router.navigate(['/perfil']);
  }

  inicio(){
    this.router.navigate(['/cobro']);
  }
}
