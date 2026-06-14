import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductForm, ProductShow } from '../product/product'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient){}

  getProducts(category?: string): Observable<ProductForm[]> {
    const params = category ? { params: {category}} : {};
    return this.http.get<ProductForm[]>(this.apiUrl, params);
  }

  addProduct(formData: FormData): Observable<ProductForm> {
    return this.http.post<ProductForm>(this.apiUrl, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<ProductForm>{
    return this.http.put<ProductForm>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductsVentas(){
    return this.http.get<ProductShow[]>(this.apiUrl);
  }

  findByBarcode(barcode: string){
    return this.http.get<ProductShow>(`${this.apiUrl}/barcode/${barcode}`);
  }
  
}
