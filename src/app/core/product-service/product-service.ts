import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../product/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient){}

  getProducts(category?: string): Observable<Product[]> {
    const params = category ? { params: {category}} : {}; //¿Para que sirve params?
    return this.http.get<Product[]>(this.apiUrl, params);//Checar este código
  }

  addProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
