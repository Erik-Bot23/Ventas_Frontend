import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../core/user/user';
import { UserService } from '../../core/user-service/user-service';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  users: User[] = [];

  form: User = {
    name: '',
    email: '',
    role: ''
  };

  constructor(
    private userservice: UserService,
    private router: Router
  ){}

  ngOnInit(){
    this.loadUsers();
  }

  loadUsers(){
    this.userservice.getUsers().subscribe(data => {
      this.users = data;
    })
  }

  logout(){
    //localStorage.clear(); //si tienes JWT
    this.router.navigate(['/keypad'])
  }
}
