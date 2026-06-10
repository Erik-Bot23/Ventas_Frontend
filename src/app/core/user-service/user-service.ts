import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(
    private http: HttpClient
  ){}

  getUsers(){
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: User){
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User){
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  //No se elimina, se desactiva el usuario
  deleteUser(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateUser(id: number){
    return this.http.patch(`${this.apiUrl}/${id}/activate`, {});
  }

}
