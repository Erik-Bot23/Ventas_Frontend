import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../core/user/user';
import { UserService } from '../../core/user-service/user-service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth-service/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})

export class Perfil implements OnInit {
  //Se inicializa la variable
  //any:
  user: any = null;

  //Cambio de contraseña
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showPasswordForm = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ){}

  //Se traen los datos del usuario
  //ngOnInit:
  ngOnInit(): void {
    const userData  = localStorage.getItem('user');

    if(userData){
      this.user = JSON.parse(userData); //JSON.parse: 
    }
  }

  togglePasswordForm(){
    this.showPasswordForm = !this.showPasswordForm;
  }

  savePassword(){
    if(!this.currentPassword || !this.newPassword || !this.confirmPassword){
      this.snack.open('Todos los campos son obligatorios', '', {duration:2000});
      return;
    }

    if(this.newPassword.length < 8){
      this.snack.open('La contraseña debe tener mínimo 8 caracteres', '', {duration:2000});
      return;
    }

    if(this.newPassword !== this.confirmPassword){
      this.snack.open('Las contraseñas no coinciden', '', {duration:2000});
      return;
    }

    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        this.snack.open('Contraseña actualizada correctamente', '', {duration:2000});
        this.showPasswordForm = false;
      },
      error: () => {
        this.snack.open('La contraseña actual es incorrecta', '', {duration:2000});
      }
    });
  }

  //Cerrar sesión
  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
