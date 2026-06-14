import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserRole } from '../user/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';
  private roleUrl = 'http://localhost:8081/api/roles'

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
  deActiveUser(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateUser(id: number){
    return this.http.patch(`${this.apiUrl}/${id}/active`, {});
  }

  getRoles(): Observable<UserRole[]>{
      return this.http.get<UserRole[]>(this.roleUrl);
  }

}
