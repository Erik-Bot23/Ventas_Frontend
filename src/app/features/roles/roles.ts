import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { RoleService } from '../../core/service/role-service/role-service';
import { Router } from '@angular/router';
import { CreateRoleRequest, PermissionModel, RoleModel, UpdateRoleRequest } from '../../core/models/role-model';
import { PermissionService } from '../../core/service/permission-service/permission-service';
import { permission } from 'process';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {
  //Desplegar menú
  menuOpen = false;

  //Declarar variables
  roles: RoleModel[] = [];
  permissions: PermissionModel[] = [];
  roleName = '';

  selectedPermissions: string[] = [];
  groupedPermissions: {[module: string]: PermissionModel[];} = {};

  editingRoleId: number | null = null;

  //Abrir y cerrar el menú
  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  togglePermission(permissionName: string): void{
    if(this.selectedPermissions.includes(permissionName)){
      this.selectedPermissions=this.selectedPermissions.filter(
        permission => permission !== permissionName
      );
    } else {
      this.selectedPermissions = [
        ...this.selectedPermissions, permissionName
      ];
    }
  }

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private router: Router
  ){}

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe(data => {
      this.permissions = data;
      this.groupPermissions();
    });
  }

  //Agrupar los permisos
  private groupPermissions(): void {
    this.groupedPermissions = {};

    this.permissions.forEach(permission => {
      const parts = permission.name.split('_');

      const module = parts.slice(1).join('_');

      if(!this.groupedPermissions[module]){
        this.groupedPermissions[module] = [];
      }

      this.groupedPermissions[module].push(permission);
    });
  }

  //Separar las palabras de los permisos
  formatPermissionName(name: string): string{
    return name.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, letter => letter.toUpperCase())
  }

  hasPermissionSelected(permissionName: string): boolean{
    return this.selectedPermissions.includes(permissionName);
  }

  saveRole(): void{
    if(this.editingRoleId !== null){
      this.updateRole();
      return;
    }

    if(!this.roleName.trim()) return;

    const request: CreateRoleRequest = {
      name: this.roleName.trim(),
      permissions: this.selectedPermissions
    };

    this.roleService.addRole(request).subscribe(newRole => {
      this.roles = [newRole, ...this.roles];
      this.resetForm();
    });
  }

  editRole(role: RoleModel): void{
    this.editingRoleId = role.id;
    this.roleName=role.name;
    this.selectedPermissions=role.permissions.map(permission => permission.name);
  }

  updateRole(): void{
    if(this.editingRoleId === null || !this.roleName.trim()){
      return;
    }

    const request: UpdateRoleRequest = {
      name: this.roleName.trim(),
      permissions: this.selectedPermissions
    };

    this.roleService.updateRole(this.editingRoleId, request).subscribe(
      updatedRole => {
        this.roles = this.roles.map(role => role.id===updatedRole.id ? updatedRole : role);
        this.resetForm();
      }
    );
  }

  deleteRole(id: number): void{
    if(confirm('¿Eliminar rol?')){

      this.roleService.deleteRole(id).subscribe(() => {
        this.roles = this.roles.filter(role => role.id !== id);
      });
    }
  }

  resetForm(): void{
    this.roleName ='';
    this.selectedPermissions = [];
    this.editingRoleId = null;
  }
}
