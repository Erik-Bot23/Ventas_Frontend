import { Injectable } from '@angular/core';;
import { Observable } from 'rxjs';
import { ProductShow } from '../../../core/interfaces/product/product';
import { CobroItem } from '../../../core/interfaces/cobro/cobro';
import { CobroService } from '../../../core/service/cobro-service/cobro-service';
import { SaleService } from '../../../core/service/sale-service/sale-service';
import { TicketService } from '../../../core/service/ticket-service/ticket-service';
import { SaleRequest } from '../../../core/interfaces/sale/sale';
import { CashFacade } from './cash-facade';
import { PaymentMethod } from '../../../core/enums/paymentMethod';


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
  selectedPaymentMethod: PaymentMethod = PaymentMethod.CASH;
  cashReceived = 0;

  //Lista de métodos
  //Permite generar botones automaticamente
  paymentMethods = [
    {
      value: PaymentMethod.CASH,
      label: 'Efectivo'
    },
    {
      value: PaymentMethod.DEBIT,
      label: 'Tarjeta de débito'
    },
    {
      value: PaymentMethod.CREDIT,
      label: 'Tarjeta de crédito'
    }
  ]

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

    this.selectedPaymentMethod = PaymentMethod.CASH;
    this.cashReceived = 0;
    this.showPaymentModal = true;
  }

  //Mostrar cambio a recibir antes de realizar la venta
  get changePreview(): number{
    if(this.selectedPaymentMethod !== PaymentMethod.CASH){
      return 0;
    }

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
      paymentMethod: this.selectedPaymentMethod,
      cashReceived: this.cashReceived,

      items: items.map(item => ({
        productId: item.product.id!,
        quantity: item.quantity
      }))
    };

    //Solo efectivo utiliza cashReceived
    if(this.selectedPaymentMethod === PaymentMethod.CASH){
      request.cashReceived = this.cashReceived;
    }

    this.saleService.processSale(request).subscribe({
      next: response => {
          const paymentLabel = this.selectedPaymentMethod === PaymentMethod.CASH ? 'Efectivo'
                              : this.selectedPaymentMethod === PaymentMethod.DEBIT ? 'Tarjeta de débito'
                              : 'Tarjeta de crédito';
          
          let message = `
                        Venta #${response.saleId}
                        Método: ${paymentLabel}
                        Total: $${response.total}`;

          if(response.paymentMethod === PaymentMethod.CASH){
            message += `
                        Recibido: $${response.cashReceived}
                        Cambio: $${response.changeAmount}`;
          }        
        
        this.ticketService.generateTicket(
          response.saleId,
          response.total,
          response.cashReceived ?? 0,
          response.changeAmount ?? 0, 
          items,
          response.paymentMethod
        );

        alert(message);

        this.cobro.clear();
        this.loadProducts();
        this.closeModalCobro();
      }, error: err => {
        alert(err.error?.message || 'Error al procesar la venta');
      }
    });
  }

  //Método para seleccionar el pago
  selectPaymentMethod(method: PaymentMethod){
    this.selectedPaymentMethod = method;

    if(method !== PaymentMethod.CASH){
      this.cashReceived = 0;
    }
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
