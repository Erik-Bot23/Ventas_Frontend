import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { UserRole } from '../../core/user/user';
import { RoleService } from '../../core/role-service/role-service';
import { Router } from '@angular/router';

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
  roles: UserRole[] = [];
  roleName = '';

  //Abrir y cerrar el menú
  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  constructor(
    private roleService: RoleService,
    private router: Router
  ){}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles(){
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  saveRole(){
    if(!this.roleName.trim()) return;

    this.roleService.addRole(this.roleName).subscribe(newCat => {
      this.roles = [newCat, ...this.roles];
      this.roleName = '';
    })
  }

  deleteRole(id: number){
    if(confirm('¿Eliminar role?')){

      this.roleService.deleteRole(id).subscribe(() => {
        this.roles = this.roles.filter(c => c.id !== id);
      });
    }
  }
}
