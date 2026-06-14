import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../product/product'; 

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient){}

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(this.apiUrl);
  }
}
