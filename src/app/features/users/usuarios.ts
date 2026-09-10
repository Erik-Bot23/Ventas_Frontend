import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserRole } from '../../core/interfaces/user/user';
import { UserService } from '../../core/service/user-service/user-service';
import { Sidebar } from '../sidebar/sidebar';
import { HasPermissionDirectives } from '../../core/routes/directives/has-permission-directives';
import { AuthService } from '../../core/service/auth-service/auth-service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, Sidebar, HasPermissionDirectives],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})

export class Usuarios implements OnInit {
  menuOpen = false;
  users: User[] = [];
  roles: UserRole[] = [];
  loading = true;
  isSaving = false;

  form: User = {
    name: '',
    email: '',
    password: '',
    roleId: 1
  };

  constructor(
    private userservice: UserService,
    private router: Router,
    public auth: AuthService
  ){}

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  loadRoles(){
    this.userservice.getRoles().subscribe(data => {
      this.roles = data;

      if(data.length > 0 && this.form.roleId === 0){
        this.form.roleId = data[0].id;
      }
    })
  }

  loadUsers(){
    this.userservice.getUsers().subscribe(data => {
      this.users = data;
      this.loading = false;
    });
  }

  save(){
    if(this.isSaving) return;

    this.isSaving = true;

    if(this.form.id){
      this.userservice.updateUser(this.form.id, 
        {
          name: this.form.name,
          email: this.form.email,
          roleId: this.form.roleId
        }
          ).subscribe({
            next: () => {
              this.loadUsers();
              this.resetForm();
            }, error: err => {
              this.isSaving = false;
              console.log('Error al actualizar', err);
            }
          });
    } else {
        this.userservice.createUser(
          {
            name: this.form.name,
            email: this.form.email,
            password: this.form.password ?? '',
            roleId: this.form.roleId
          }
            ).subscribe({
              next: () => {
                this.loadUsers();
                this.resetForm();
                console.log('Usuario guardado');
              }, error: err => {
                this.isSaving = false;
                console.log('Error al guardar', err);
              }
            });
    }
  }

  resetForm(){
    this.form = {
      name: '',
      email: '',
      password: '',
      roleId: 0
    };
    this.isSaving = false;
  }

  editUser(user: User){
    this.form = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      roleName: user.roleName
    };
  }

  deactivateUser(id?: number){
    if(!id) return;

    if(confirm('¿Seguro que deseas dar de baja este usuario?')){
      this.userservice.deActiveUser(id).subscribe({
        next: () => {
          const user = this.users.find(u => u.id === id);
          if(user){
            user.active = false;
          }
          console.log('Usuario dado de baja');
        }, error: (err) => console.error('Error al dar de baja', err)
      });
    }
  }

  activateUser(id?: number){
    if (!id) return;
    
    if(confirm('¿Seguro que deseas dar de alta a este usuario?')){
      this.userservice.activateUser(id).subscribe({
        next: () => {
          const user = this.users.find(u => u.id === id);
          if(user){
            user.active = true;
          }
          console.log("Usuario activado")
        }, error: (err) => console.log('Error al dar de alta', err)
      });
    }
  }
}
