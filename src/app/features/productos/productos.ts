import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../core/product/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/product-service/product-service';
import { Router } from '@angular/router';
import { Category } from '../../core/category/category';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService } from '../../core/category-service/category-service';
import { error } from 'console';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})

export class Productos implements OnInit {
  menuOpen = true;

  products: Product[] = [];
  categories: Category[] = [];
  selectedFile: File | null = null;
  loading = true;
  @ViewChild('fileInput') fileInput: any;
  isSaving = false;
  private loaded = false;

  form: Product = {
    name: '',
    price: 0,
    stock: 0,
    categoryId: 0
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ){}

  ngOnInit() {
    if(!this.loaded){
      this.loadProducts();
      this.loadCategories();
      this.loaded = true;
    }
    
  }

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  loadProducts(){
    console.log("Cargando productos...");
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.loading = false;
    });
  }

  loadCategories(){
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0] ?? null;
  }

  save(){
    if(this.isSaving) return;

    this.isSaving = true;

    const formData = new FormData();

    formData.append('name', this.form.name);
    formData.append('price', this.form.price.toString());
    formData.append('stock', this.form.stock.toString());
    formData.append('categoryId', this.form.categoryId.toString());

    if(this.selectedFile){
      formData.append('image', this.selectedFile)
    }

    if(this.form.id){
      //Editar
      this.productService.updateProduct(this.form.id, formData).subscribe({
        next: (updatedProduct) => {
          this.products = this.products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
          this.resetForm();
        }, error: (err) => {
          this.isSaving = false;
          console.log('Error al actualizar', err);
        }
      });
    } else {
        //Crear
        this.productService.addProduct(formData).subscribe({
        next: (product) => {
          //this.products.unshift(product);
          this.products = [product, ...this.products];
          this.resetForm();
          console.log('Producto guardado');
        }, error: (err) => {
          this.isSaving = false;
          console.log('Error al guardar', err);
        }
      });
    }
  }

  resetForm(){
    this.form = {
      name: '',
      price: 0,
      stock: 0,
      categoryId: 0
    };

    this.selectedFile = null
    this.fileInput.nativeElement.value = '';
    this.isSaving = false;
  }

  editProduct(product: Product){
    this.form = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId
    };
  }

  deleteProduct(id?: number){
    if(!id) return;

    if(confirm('¿Seguro que deseas eliminar este producto?')){
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          console.log('Producto eliminado');
        }, error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  validateNumber(field: 'price' | 'stock'){
    if(this.form[field] < 1){
      this.form[field] = 1;
    }
  }

  perfil(){
    this.router.navigate(['/perfil']);
  }

  ventas(){
    this.router.navigate(['/ventas']);
  }

  inicio(){
    this.router.navigate(['/cobro']);
  }

  caja(){
    this.router.navigate(['/caja']);
  }

  clientes(){
    this.router.navigate(['/cliente']);
  }

  compras(){
    this.router.navigate(['/compras']);
  }

  facturas(){
    this.router.navigate(['/facturas']);
  }

  productos(){
    this.router.navigate(['/productos']);
  }

  reportes(){
    this.router.navigate(['/reportes']);
  }

  usuarios(){
    this.router.navigate(['/usuarios']);
  }
}
