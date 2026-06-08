import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  user = {
    name: 'erik',
    role: 'admin',
    email: 'erik@gmail.com'
  }

  constructor(private router: Router){}

  logout(){
    localStorage.clear(); //si tienes JWT
    this.router.navigate(['/keypad'])
  }
}
