import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth-service/auth-service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../core/login/login'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login {
  //Se inicializan las variables a utilizar
  email='';
  password='';
  error='';
  loading = false; //loading:

  //Se llaman las clases en el constructor
  constructor(
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ){}

  //Botón de iniciar sesión
  //Se valida al usuario desde la BD
  submit(){
    //Validar si los campos estan vacíos
    if(!this.email || !this.password){
      this.snack.open('Completa los campos', '', {duration:1500})
      return;
    }

    this.loading=true;

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({ //subscribe:
      next: (res: LoginResponse) => { //next:
        this.loading=false;

        if(res.success){ //success:
          this.snack.open('Bienvenido', '', {duration: 1000});//snack:
          // Luego aquí irá JWT
          this.auth.saveToken(res.token);

          this.auth.saveUser(res);//localStorage:
                                //JSON.stringify:

          this.router.navigate(['/cobro']); //navigate: función para nevegar entre secciones
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
