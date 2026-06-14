import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../core/user/user';
import { UserService } from '../../core/user-service/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})

export class Perfil implements OnInit {
  //Se inicializa la variable
  //any:
  user: any = null;

  constructor(
    private userservice: UserService,
    private router: Router
  ){}

  //Se traen los datos del usuario
  //ngOnInit:
  ngOnInit(): void {
    const userData  = localStorage.getItem('user');

    if(userData){
      this.user = JSON.parse(userData); //JSON.parse: 
    }
  }

  //Cerrar sesión
  logout(){
    //localStorage.clear(); //si tienes JWT
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
