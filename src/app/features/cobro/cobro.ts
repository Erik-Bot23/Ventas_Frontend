import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/product/product';
import { Observable } from 'rxjs';
import { CartItem } from '../../core/cart/cart';
import { ProductService } from '../../core/product-service/product-service';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart-service/cart-service';

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

  cartItems$!: Observable<CartItem[]>;
  total$!: Observable<number>;

  //Agrega esto aquí
  menuOpen = false;

  constructor(
    private productService: ProductService,
    public cart: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.loadProducts();
    this.cart.loadCart();

    this.cartItems$ = this.cart.cart$;
    this.total$ = this.cart.getTotal();
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
    this.cart.add(product);
  }

  removeItem(id?: number){
    if(!id) return;
    this.cart.removeOne(id);
  }

  cobrar(){
    const items = this.cart.cart$.value;

    if(!items.length){
      alert("⚠️ No hay productos en el carrito");
      return;
    }

    this.cart.getTotal().subscribe(total => {
      if(total <= 0){
        alert("⚠️ Total inválido");
      }

      alert("✅ Venta realizada");
      this.cart.clear();
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
