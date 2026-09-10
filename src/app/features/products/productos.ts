import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductForm, Category } from '../../core/interfaces/product/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/service/product-service/product-service';
import { Router } from '@angular/router';
import { CategoryService } from '../../core/service/category-service/category-service';
import { Sidebar } from '../sidebar/sidebar';
import { AuthService } from '../../core/service/auth-service/auth-service';
import { HasPermissionDirectives } from '../../core/routes/directives/has-permission-directives';
// Servicio compartido del sidebar (reemplaza menuOpen local)
import { SidebarService } from '../../core/service/sidebar-service/sidebar-service';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, Sidebar, HasPermissionDirectives],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})

export class Productos implements OnInit {
  // ANTES: menuOpen = false aqui (estado local)
  // AHORA: se usa sidebar.menuOpen del servicio compartido
  products: ProductForm[] = [];
  categories: Category[] = [];
  selectedFile: File | null = null;
  loading = true;
  @ViewChild('fileInput') fileInput: any;
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
    private router: Router,
    public auth: AuthService,
    // Inyectar servicio compartido del sidebar
    public sidebar: SidebarService
  ){}

  ngOnInit() {
    if(!this.loaded){
      this.loadProducts();
      this.loadCategories();
      this.loaded = true;
    }
  }

  // ANTES: toggleMenu() controlaba menuOpen local.
  // AHORA: el sidebar emite el evento toggle y el componente actualiza sidebar.menuOpen
  // desde el template: (toggle)="sidebar.menuOpen = $event"

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
    if(!this.form.id && !this.auth.hasPermission('CREAR_PRODUCTOS')){
      return;
    }

    if(this.form.id && !this.auth.hasPermission('EDITAR_PRODUCTOS')){
      return;
    }

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
    if(!this.auth.hasPermission('ELIMINAR_PRODUCTOS')){
      return;
    }

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
