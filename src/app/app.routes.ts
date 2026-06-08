import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/login/login').then(m=>m.Login) },
    { path: 'cobro', loadComponent: () => import('./features/cobro/cobro').then(m=>m.Cobro) },
    { path: 'perfil', loadComponent: () => import('./features/perfil/perfil').then(m=>m.Perfil) },
    { path: 'cliente', loadComponent: () => import('./features/clientes/clientes').then(m=>m.Clientes) },
    { path: 'compras', loadComponent: () => import('./features/compras/compras').then(m=>m.Compras) },
    { path: 'facturas', loadComponent: () => import('./features/facturas/facturas').then(m=>m.Facturas) },
    { path: 'productos', loadComponent: () => import('./features/productos/productos').then(m=>m.Productos) },
    { path: 'reportes', loadComponent: () => import('./features/reportes/reportes').then(m=>m.Reportes) },
    { path: 'usuarios', loadComponent: () => import('./features/usuarios/usuarios').then(m=>m.Usuarios) },
    { path: 'ventas', loadComponent: () => import('./features/ventas/ventas').then(m=>m.Ventas) },
    { path: 'caja', loadComponent: () => import('./features/caja/caja').then(m=>m.Caja) },
    { path: '**', redirectTo: '' }
];

export class AppRoutingModule{}
