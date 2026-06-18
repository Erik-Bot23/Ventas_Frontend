import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductShow } from '../../core/product/product';
import { Observable } from 'rxjs';
import { CobroItem } from '../../core/cobro/cobro';
import { Router } from '@angular/router';;
import { CobroService } from '../../core/cobro-service/cobro-service';
import { SaleService } from '../../core/sale-service/sale-service';
import { SaleRequest } from '../../core/sale/sale';

@Component({
  selector: 'app-cobro',
  imports: [CommonModule, FormsModule],
  templateUrl: './cobro.html',
  styleUrl: './cobro.css',
})

export class Cobro implements OnInit {
  //Inicializar las variables
  products: ProductShow[] =[];
  filteredProducts: ProductShow[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  search = '';
  searchResults: ProductShow[] = [];

  cobroItems$!: Observable<CobroItem[]>;
  total$!: Observable<number>;

  //Agrega esto aquí
  menuOpen = false;

  constructor(
    public cobro: CobroService,
    private productService: SaleService,
    private saleService: SaleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.cobroItems$ = this.cobro.cart$;
    this.total$ = this.cobro.getTotalLocal();
  }

  //Se cargan los productos localmente en la tabla de ventas
  loadProducts(){
    this.productService.getProductsVentas().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;

      //Obtener categorías únicas
      //this:
      //...new:
      //Set:
      //filter: 
      this.categories = [...new Set(products.map(p => p.categoryName).filter(Boolean))];
    });
  }

  //Abrir y cerrar el menú
  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  //Buscar productos
  onSearch(){
    if(this.search.length < 2){
      this.searchResults = [];
      return;
    }

    this.productService.searchProducts(this.search).subscribe(res => {
      this.searchResults = res;
    });
  }

  selectProduct(product: ProductShow){
    if(product.stock <= 0){
      alert('Producto sin existencia');
      return;
    }

    this.cobro.add(product);
    this.search = '';
    this.searchResults = [];
  }

  //Agregar producto al carrito
  add(product: ProductShow){
    if(product.stock <= 0){
      alert('Producto sin existencia')
      return;
    }
    this.cobro.add(product);
  }

  //Remover un solo producto de la lista
  removeItem(id?: number){
    if(!id) return;
    this.cobro.removeAll(id);
  }

  //Botones de incrementar o decrementar el producto
  increase(product: ProductShow){
    this.cobro.add(product);
  }

  decrease(id?: number){
    if(!id) return;
    this.cobro.removeOne(id);
  }

  //Método de cobrar
  cobrar(){
    const items = this.cobro.cart$.value;

    //Se valida si el carro esta vacío
    if(!items.length){
      alert("⚠️ No hay productos en el carrito");
      return;
    }

    const request: SaleRequest = {
      paymentMethod: 'CASH',
      cashReceived: 1000,
      items: items.map(item => ({ 
        productId: item.product.id!,
        quantity: item.quantity
      }))
    };

    this.saleService.processSale(request).subscribe({
      next: response => {
        alert(`Venta #${response.saleId}
              Total: ${response.total}`);
        
          this.cobro.clear();
          this.loadProducts();
      }, error: err => {
        alert(err.error.message);
      }
    });
  }

  //Navegación del menú
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
