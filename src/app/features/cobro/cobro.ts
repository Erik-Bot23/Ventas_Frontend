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
  categories: number[] = [];
  selectedCategory: number | null = null;
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
      this.categories = [...new Set(products.map(p => p.categoryId))];
    });
  }

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  filter() {
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(this.search.toLowerCase()) && (this.selectedCategory ? p.categoryId === this.selectedCategory : true) 
    );
  }

  selectCategory(cat: number){
    this.selectedCategory = cat;
    this.filter();
  }

  add(product: Product){
    this.cobro.add(product);
  }

  removeItem(id?: number){
    if(!id) return;
    this.cobro.removeOne(id);
  }

  cobrar(){
    const items = this.cobro.cart$.value;

    if(!items.length){
      alert("⚠️ No hay productos en el carrito");
      return;
    }

    this.cobro.getTotal().subscribe(total => {
      if(total <= 0){
        alert("⚠️ Total inválido");
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
