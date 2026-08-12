import { Injectable } from "@angular/core";
import { CashRegister, CashSummary } from "../../../core/interfaces/cash-interface/cash-interface";
import { CashService } from "../../../core/service/cash-service/cash-service"; 
import { AuthService } from "../../../core/service/auth-service/auth-service"; 

@Injectable({
  providedIn: 'root'
})

export class CashFacade  {

  //Variables para cash
  cashStatus?: CashRegister;
  cashSummary?: CashSummary;
  
  showOpenCashModal = false;
  openingAmount = 0 ;

  showCloseCashModal = false;
  closingAmount = 0;

  userName = '';

  //Variables para fecha
  today: string = '';

  constructor(
    private cashService: CashService,
    private authService: AuthService
  ){}

  initialize(){
    this.loadCashRegister();
    this.showUser();
    this.date();
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
        this.cashStatus = res;
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
        alert(err.error?.message || 'Error al cargar el resumen');
      }
    });
  }

  confirmCloseCashModal(){
    this.showCloseCashModal = false;

    this.cashService.closeCash(this.closingAmount).subscribe({
      next: () => {
        this.cashStatus = undefined;
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
        this.cashStatus = res;
      }, error: err => {
        if(err.status === 404){
          this.cashStatus = undefined;
        }
        //this.showOpenCashModal = true;
      }
    });
  }

  //Diferencia en tiempo real
  get differencePreview(): number{
    if(!this.cashSummary){
      return 0;
    }
    return this.closingAmount - (this.cashSummary.expectedAmount || 0);
  }

  //Método de fecha
  date(){
    this.today = new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  //Estatus de la caja
  get isOpen(): boolean {
    return !!this.cashStatus;
  }
}