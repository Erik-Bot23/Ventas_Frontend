import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserRole } from '../../core/user/user';
import { UserService } from '../../core/user-service/user-service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})

export class Usuarios implements OnInit {
  menuOpen = true;

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
    private router: Router
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
      //Editar
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
        //Crear
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

  reportes(){
    this.router.navigate(['/reportes']);
  }

  usuarios(){
    this.router.navigate(['/usuarios']);
  }
}

