import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/product/product';
import { Observable } from 'rxjs';
import { CobroItem } from '../../core/cobro/cobro';
import { ProductService } from '../../core/product-service/product-service';
import { Router } from '@angular/router';;
import { CobroService } from '../../core/cobro-service/cobro-service';

@Component({
  selector: 'app-cobro',
  imports: [CommonModule, FormsModule],
  templateUrl: './cobro.html',
  styleUrl: './cobro.css',
})
export class Cobro implements OnInit {
  products: Product[] =[];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  search = '';

  cobroItems$!: Observable<CobroItem[]>;
  total$!: Observable<number>;

  //Agrega esto aquí
  menuOpen = false;

  constructor(
    private productService: ProductService,
    public cobro: CobroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.cobro.loadCart();

    this.cobroItems$ = this.cobro.cart$;
    this.total$ = this.cobro.getTotalLocal();
  }

  loadProducts(){
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;

      //Obtener categorías únicas
      this.categories = [...new Set(products.map(p => p.categoryName).filter(Boolean))];
    });
  }

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  //Filtrar productos
  filter() {
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(this.search.toLowerCase()) && (!this.selectedCategory || p.categoryName === this.selectedCategory) 
    );
  }

  //Buscar el producto
  searchProduct(){
    this.filter();
  }

  //Seleccionar categoría
  selectCategory(cat: string){
    this.selectedCategory = cat;
    this.filter();
  }

  //Agregar producto al carrito
  add(product: Product){
    if(product.stock <= 0){
      alert('Producto sin existencia')
      return;
    }
    this.cobro.add(product);
  }

  //Remover un solo producto de la lista
  removeItem(id?: number){
    if(!id) return;
    this.cobro.removeOne(id);
  }

  //Botones de incrementar o decrementar el producto
  increase(product: Product){
    this.cobro.add(product);
  }

  decrease(id?: number){
    if(!id) return;
    this.cobro.removeOne(id);
  }

  //Método de cobrar
  cobrar(){
    const items = this.cobro.cart$.value;

    if(!items.length){
      alert("⚠️ No hay productos en el carrito");
      return;
    }

    this.cobro.getTotal().subscribe(total => {
      if(total <= 0){
        alert("⚠️ Total inválido"); //Aquí debe ir un modal con el resumen de la venta y la opción de confirmar la venta
      }

      alert("✅ Venta realizada");
      this.cobro.clear();
    });
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
