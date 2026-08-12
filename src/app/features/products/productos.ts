import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductForm, Category } from '../../core/interfaces/product/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/service/product-service/product-service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService } from '../../core/service/category-service/category-service';
import { Sidebar } from '../sidebar/sidebar';
import { error } from 'console';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, HttpClientModule, Sidebar],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})

export class Productos implements OnInit {
  //Se inicializan las variables
  menuOpen = false;
  products: ProductForm[] = []; //Un arreglo de productos
  categories: Category[] = []; //Un arreglo de categorias
  selectedFile: File | null = null;
  loading = true;
  //Se carga el gestor de archivos para elegir la img
  //VierChild:
  @ViewChild('fileInput') fileInput: any; //fileInput:
  isSaving = false;
  private loaded = false;

  //Se inicializan los atributos de la interface
  //form:
  form: ProductForm = {
    name: '',
    price: 0,
    stock: 0,
    sku: '',
    barcode: '',
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

  //Se cargan los productos desde la BD
  loadProducts(){
    console.log("Cargando productos...");
    this.productService.getProducts().subscribe(data => { //data:
      this.products = data;
      this.loading = false;
    });
  }

  //Se cargan las categorias desde la BD
  loadCategories(){
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  //Se selecciona el archivo
  onFileSelected(event: any){ //event:
    //target:
    //files:
    this.selectedFile = event.target.files[0] ?? null; //??
  }

  //Guardar el producto en la BD
  save(){
    if(this.isSaving) return;

    this.isSaving = true;

    const formData = new FormData();//formData: 

    formData.append('name', this.form.name);
    formData.append('price', this.form.price.toString());
    formData.append('stock', this.form.stock.toString());
    formData.append('categoryId', this.form.categoryId.toString());
    formData.append('sku', this.form.sku);
    formData.append('barcode', this.form.barcode);

    if(this.selectedFile){
      formData.append('image', this.selectedFile)//append:
    }

    if(this.form.id){
      //Editar
      this.productService.updateProduct(this.form.id, formData).subscribe({
        next: (updatedProduct) => {//Variable temporal?
          //?
          //:
          //=>
          //map:
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

  //Los campos se resetean(se ponen en blanco)
  resetForm(){
    this.form = {
      name: '',
      price: 0,
      stock: 0,
      sku: '',
      barcode: '',
      categoryId: 0
    };

    this.selectedFile = null
    this.fileInput.nativeElement.value = '';//nativeElement
    this.isSaving = false;
  }

  //Se edita el producto
  editProduct(product: ProductForm){ //Variable de la interface(se consumen sus atributos)
    this.form = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      barcode: product.barcode,
      categoryId: product.categoryId
    };
  }

  //Se elimina el producto de la BD
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

  //Validar campos numericos
  validateNumber(field: 'price' | 'stock'){//Field: 
    if(this.form[field] < 1){
      this.form[field] = 1;
    }
  }

  categorias(){
    this.router.navigate(['/categorias'])
  }

}
