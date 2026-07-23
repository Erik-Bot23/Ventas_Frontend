import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductShow } from '../../core/product/product';
import { last, Observable } from 'rxjs';
import { CobroItem } from '../../core/cobro/cobro';
import { Router } from '@angular/router';;
import { CobroService } from '../../core/cobro-service/cobro-service';
import { SaleService } from '../../core/sale-service/sale-service';
import { SaleRequest } from '../../core/sale/sale';
import { response } from 'express';
import { TicketService } from '../../core/ticket-service/ticket-service';
import { Sidebar } from '../sidebar/sidebar';
import { CashService } from '../../core/cash-service/cash-service';
import { CashRegister, CashSummary } from '../../core/cash-interface/cash-interface';
import { error } from 'node:console';
import { AuthService } from '../../core/auth-service/auth-service';

@Component({
  selector: 'app-cobro',
  imports: [CommonModule, FormsModule, Sidebar],
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

  //Variables para cash
  cashSummary?: CashSummary;
  cashFlag?: CashRegister;
  showOpenCashModal = false;
  openingAmount = 0 ;

  showCloseCashModal = false;
  closingAmount = 0;

  userName = '';

  //Variables para fecha
  today: string = '';


  constructor(
    public cobro: CobroService,
    private saleService: SaleService,
    private ticketService: TicketService,
    private cashService: CashService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.cobroItems$ = this.cobro.cart$;
    this.total$ = this.cobro.getTotalLocal();
    this.loadCashRegister();
    this.date();
    this.showUser();
  }

  //Obtener el usuario
  showUser(){
    this.userName = this.authService.getUsername();
  }

  //Método para abrir modal de caja
  openCashModal(){
    this.showOpenCashModal = true;
  }

  confirmOpenCashModal(){
    this.showOpenCashModal = false;

    this.cashService.openCash(this.openingAmount).subscribe({
      next: res => {
        this.cashFlag = res;
        this.openingAmount = 0;
        alert('Caja abierta');
      }, error: err => {
            this.showOpenCashModal = true;
            alert(err.error.message);
      }
    });
  }

  //Método para cerrar modal de caja
  closeCashModal(){
    this.cashService.getSummary().subscribe({
      next: res => {
        this.cashSummary = res;
        this.showCloseCashModal = true;
      }, error: err => {
        console.log(err);
        console.log('ERROR SUMMARY', err);
        console.log(err);
        console.log(err.status);
        console.log(err.error);
        alert(err.error?.message || 'Error al cargar el resumen');
      }
    });
  }

  confirmCloseCashModal(){
    this.showCloseCashModal = false;

    this.cashService.closeCash(this.closingAmount).subscribe({
      next: () => {
        this.cashFlag = undefined;
        this.cashSummary = undefined;
        this.closingAmount = 0;
        alert('Caja cerrada');
      }, error: err => {
        this.showCloseCashModal = true;
        alert(err.error.message);
      }
    });
  }

  //Método para checar caja activa
  loadCashRegister(){
    this.cashService.getActiveCash().subscribe({
      next: res => {
        this.cashFlag = res;
      }, error: err => {
        if(err.status === 404){
          this.cashFlag = undefined;
        }
        //this.showOpenCashModal = true;
      }
    });
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

    this.saleService.searchProducts(this.search).subscribe({
      next: res => {
      console.log("Resultados", res);
      this.searchResults = res;
    }, error: err => {
      console.error(err);
      }
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
    if(!this.cashFlag){
      alert("No hay caja abierta");
      return;
    }

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
          response.cashReceived,
          response.changeAmount, 
          items
        );

        alert(`Venta #${response.saleId}
              Total: $${response.total}
              Recibido: $${response.cashReceived}
              Cambio: $${response.changeAmount}`);

        this.cobro.clear();
        this.loadProducts();
        this.closeModalCobro();
      }, error: err => {
        alert(err.error?.message || 'Error al procesar la venta');
      }
    });
  }

  //Cerrar el modal de cobro
  closeModalCobro(){
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

  //Método de fecha
  date(){
    this.today = new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  //Diferencia en tiempo real
  get differencePreview(): number{
    if(!this.cashSummary){
      return 0;
    }
    return this.closingAmount - (this.cashSummary.expectedAmount || 0);
  }
}
