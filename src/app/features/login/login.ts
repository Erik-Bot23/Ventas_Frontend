import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth-service/auth-service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../core/loginResponse/login-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email='';
  password='';
  error='';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ){}

  submit(){
    if(!this.email || !this.password){
      this.snack.open('Completa los campos', '', {duration:1500})
      return;
    }

    this.loading=true;

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: LoginResponse) => {
        this.loading=false;

        if(res.success){
          this.snack.open('Bienvenido', '', {duration: 1000});
          // Luego aquí irá JWT
          localStorage.setItem('user', JSON.stringify({
            id: res.id,
            email: res.email,
            name: res.name,
            role: res.role
          }));
          this.router.navigate(['/cobro']);
        } else{
          this.snack.open('Credenciales incorrectas', '', {duration: 1500});
        }
      },
      error: () => {
        this.loading=false;
        this.snack.open('Error de servidor', '', {duration: 1500});
      }
    });
  }
}
