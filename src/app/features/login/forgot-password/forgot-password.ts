import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth-service/auth-service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private snack: MatSnackBar
  ){}

  send(){
    if(!this.email){
      this.snack.open('Ingrese un correo', '', {duration:2000});
      return;
    }

    this.loading = true;

    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.loading=false;
        this.snack.open('Correo enviado correctamente', '', {duration:3000});
      }, error: err =>{
        this.loading=false;

        this.snack.open(err.error?.message ?? 'No fue posible enviar el correo', '', {duration:3000});
      }
    });

  }
}
