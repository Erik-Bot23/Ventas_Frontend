import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/user/user';
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
  loading = true;
  isSaving = false;

  form: User = {
    name: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(
    private userservice: UserService,
    private router: Router
  ){}

  ngOnInit() {
    this.loadUsers();
  }

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
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
          role: this.form.role
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
            role: this.form.role
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
      role: 'CAJERO'
    };
    this.isSaving = false;
  }

  editUser(user: User){
    this.form = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role
    };
  }

  deleteUser(id?: number){
    if(!id) return;

    if(confirm('¿Seguro que deseas eliminar este producto?')){
      this.userservice.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(p => p.id !== id);
          console.log('Producto eliminado');
        }, error: (err) => console.error('Error al eliminar', err)
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

