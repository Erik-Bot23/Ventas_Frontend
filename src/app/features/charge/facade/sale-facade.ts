import { Injectable } from '@angular/core';;
import { Observable } from 'rxjs';
import { ProductShow } from '../../../core/interfaces/product/product';
import { CobroItem } from '../../../core/interfaces/cobro/cobro';
import { CobroService } from '../../../core/service/cobro-service/cobro-service';
import { SaleService } from '../../../core/service/sale-service/sale-service';
import { TicketService } from '../../../core/service/ticket-service/ticket-service';
import { SaleRequest } from '../../../core/interfaces/sale/sale';
import { CashFacade } from './cash-facade';


@Injectable({
  providedIn: 'root'
})

export class SaleFacade {
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
    private cashFacade: CashFacade
  ) {}

  initialize(){
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

    this.saleService.searchProducts(this.search).subscribe({
      next: res => {
      console.log("Resultados", res);
      this.searchResults = res;
    }, error: err => {
      console.error(err);
      }
    });
  }

  //No se selecciona un producto si no hay
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
    if(!this.cashFacade.isOpen){
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
}
