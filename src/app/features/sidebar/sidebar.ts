import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth-service/auth-service';
import { permission } from 'process';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth: AuthService){}

  menuOpen = false;
  @Output() toggle = new EventEmitter<boolean>();

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
    this.toggle.emit(this.menuOpen);
    this.cd.detectChanges();
  }

  //Obtener el nombre del usuario}
  get userName(): string {
    return this.auth.getUsername();
  }

  //
  menuItems = [
    {
      label: 'Productos',
      route: '/productos',
      permission: 'VER_PRODUCTOS'
    },
    {
      label: 'Usuarios',
      route: '/usuarios',
      permission: 'VER_USUARIOS'
    },
    {
      label: 'Ventas',
      route: '/ventas',
      permission: 'VER_VENTAS'
    },
    {
      label: 'Roles',
      route: '/roles',
      permission: 'VER_ROLES'
    }
  ]


  //
  go(route: string){
    this.router.navigate([route]);
  }

   //Navegación del menu desplegable
  perfil(){
    this.router.navigate(['/perfil']);
  }

  ventas(){
    this.router.navigate(['/ventas']);
  }

  inicio(){
    this.router.navigate(['/cobro']);
  }

  caja(){
    this.router.navigate(['/caja']);
  }

  clientes(){
    this.router.navigate(['/cliente']);
  }

  compras(){
    this.router.navigate(['/compras']);
  }

  facturas(){
    this.router.navigate(['/facturas']);
  }

  productos(){
    this.router.navigate(['/productos']);
  }

  categorias(){
    this.router.navigate(['/categorias'])
  }

  reportes(){
    this.router.navigate(['/reportes']);
  }

  usuarios(){
    this.router.navigate(['/usuarios']);
  }

  roles(){
    this.router.navigate(['/roles']);
  }
}
