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
import { response } from 'express';
import { TicketService } from '../../core/ticket-service/ticket-service';

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
  barcode = '';

  cobroItems$!: Observable<CobroItem[]>;
  total$!: Observable<number>;

  //Desplegar menú
  menuOpen = false;

  //Desplegar modal de cobro
  showPaymentModal = false;
  cashReceived = 0;


  constructor(
    public cobro: CobroService,
    private saleService: SaleService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.cobroItems$ = this.cobro.cart$;
    this.total$ = this.cobro.getTotalLocal();
  }

  //Se cargan los productos localmente en la tabla de ventas
  loadProducts(){
    this.saleService.getProductsVentas().subscribe(products => {
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

    this.saleService.searchProducts(this.search).subscribe(res => {
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

  //Método de abrir modal de cobro
  openPaymenteModal(){
    const items = this.cobro.cart$.value;

    if(!items.length){
      alert("No hay productos en el carrito");
      return;
    }
    this.showPaymentModal = true;
  }

  //Mostrar cambio a recibir antes de realizar la venta
  get changePreview(): number{
    const total = this.cobro.cart$.value.reduce((sum, item) => sum + item.subtotal, 0);

    return this.cashReceived - total;
  }

  //Confirmar pago
  confirmPayment(){
    const items = this.cobro.cart$.value;

    if(!items.length){
      return;
    }

    const request: SaleRequest = {
      paymentMethod: 'CASH',
      cashReceived: this.cashReceived,

      items: items.map(item => ({
        productId: item.product.id!,
        quantity: item.quantity
      }))
    };

    this.saleService.processSale(request).subscribe({
      next: response => {
        this.ticketService.generateTicket(
          response.saleId,
          response.total,
          response.changeAmount, 
          items
        );

        alert(`Venta #${response.saleId}
              Total: $${response.total}
              Cambio: $${response.changeAmount}`);

        this.cobro.clear();
        this.loadProducts();
        this.closeModal();
      }, error: err => {
        alert(err.error?.message || 'Error al procesar la venta');
      }
    });
  }

  //Cerrar el modal de cobro
  closeModal(){
    this.showPaymentModal = false;
    this.cashReceived = 0;
  }

  //Método para buscar por codigo de barras
  searchBarcode(){
    if(!this.barcode.trim()){
      return;
    }

    this.saleService.findByBarcode(this.barcode).subscribe({
      next: product => {
        this.cobro.add(product);
        this.barcode = '';
      }, error: () => {
        alert('Producto no encontrado');
        this.barcode = '';
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
