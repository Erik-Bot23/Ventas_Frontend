import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth-service/auth-service';
// Importar el servicio compartido que maneja el estado del menu
import { SidebarService } from '../../core/service/sidebar-service/sidebar-service';
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
    public auth: AuthService,
    // Inyectar el servicio compartido.
    // "public" permite accederlo desde el template como sidebar.menuOpen
    public sidebar: SidebarService){}

  // ANTES: tenia menuOpen = false aqui (estado local del componente).
  // AHORA: se elimino porque el estado vive en SidebarService.
  // Asi todos los componentes comparten el mismo estado.

  // Evento que se envia al componente padre cuando el usuario abre/cierra el menu manualmente
  @Output() toggle = new EventEmitter<boolean>();

  /**
   * Abrir/cerrar el menu al hacer clic en el boton "Menu".
   *
   * 1. Invierte sidebar.menuOpen (el servicio compartido).
   * 2. Emite el evento toggle para que el padre (cobro, productos, etc.)
   *    actualice su variable local y aplique la clase CSS collapsed.
   * 3. detectChanges() fuerza a Angular a redibujar el DOM inmediatamente.
   */
  toggleMenu(){
    this.sidebar.menuOpen = !this.sidebar.menuOpen;
    this.toggle.emit(this.sidebar.menuOpen);
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
