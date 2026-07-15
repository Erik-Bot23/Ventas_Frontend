import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from '../user/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = `${environment.api}/roles`;
  //private apiUrl = 'http://localhost:8081/api/roles';

  constructor(private http: HttpClient){}

  getRoles(): Observable<UserRole[]>{
    return this.http.get<UserRole[]>(this.apiUrl);
  }

  addRole(name: string): Observable<UserRole>{
    return this.http.post<UserRole>(this.apiUrl, { name });
  }

  deleteRole(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
