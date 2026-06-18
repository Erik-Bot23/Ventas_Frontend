import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductForm } from '../product/product'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
//Se usará en features/productos/productos.ts
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient){}

  //Trae los productos de la BD
  getProducts(category?: string): Observable<ProductForm[]> {
    const params = category ? { params: {category}} : {};
    return this.http.get<ProductForm[]>(this.apiUrl, params); //params:
  }

  //Añade productos a la BD
  addProduct(formData: FormData): Observable<ProductForm> {
    return this.http.post<ProductForm>(this.apiUrl, formData); //formData:
  }

  //Actualiza producto en la BD
  updateProduct(id: number, formData: FormData): Observable<ProductForm>{
    return this.http.put<ProductForm>(`${this.apiUrl}/${id}`, formData);
  }

  //Borra un producto en la BD
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
