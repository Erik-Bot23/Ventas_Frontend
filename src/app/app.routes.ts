import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    //Se definen las rutas de todas las paginas
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
    { path: 'categorias', loadComponent: () => import('./features/categorias/categorias').then(m=>m.Categorias) },
    { path: 'roles', loadComponent: () => import('./features/roles/roles').then(m=>m.Roles) },
    { path: 'forgot-password', loadComponent: () => import('./features/login/forgot-password/forgot-password').then(m=>m.ForgotPassword) },
    { path: 'reset-password', loadComponent: () => import('./features/login/reset-password/reset-password').then(m=>m.ResetPassword) },
    { path: '**', redirectTo: '' }
];

export class AppRoutingModule{}
