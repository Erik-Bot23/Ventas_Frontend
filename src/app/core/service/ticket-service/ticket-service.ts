import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { PaymentMethod } from '../../enums/paymentMethod';
import { CardPaymentResponse } from '../../interfaces/payment/payment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  generateTicket(
    saleId: number,
    total: number,
    recibido: number,
    cambio: number,
    items: any[],
    paymentMethod: PaymentMethod,
    cardData?: CardPaymentResponse
  ){
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 200] //Tamaño de ticket térmico
    });

    let y = 5;

    // =========================================
    // 1. ENCABEZADO
    // =========================================
    doc.setFontSize(14);
    doc.setTextColor(0,0,0);
    doc.setFont('helvetica', 'bold');
    doc.text('Tienda "Buscar nombre"', 40, y, { align: 'center' });
    y *= 6;

    doc.setFontSize(8);
    doc.setFont('helvitica', 'normal');
    doc.setTextColor(100, 100, 1000);
    doc.text('Calle Principal No.123, Col. Centro', 40, y, { align: 'center' });
    y += 4;
    doc.text('Tel: 555-123-4567', 40, y, {align: 'center'});
    y += 4;
    doc.text('RFC: XXXX-XXXX-XXX', 40, y, { align: 'center' });
    y += 6;

    //Línea separadora
    doc.setDrawColor(200,200,200);
    doc.line(5,y,75,y);
    y+= 4;

    // =========================================
    // 2. INFORMACIÓN DE LA VENTA
    // =========================================
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('TICKET DE VENTA', 40, y, { align: 'center' });
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    //Fecha y hora
    const now = new Date();
    const fecha = now.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const hora = now.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    doc.text(`Ticket: #${String(saleId).padStart(6, 'o')}`, 10, y);
    doc.text(`Fecha: ${fecha} ${hora}`, 10, y + 4);
    y += 10;

    // =========================================
    // 3. MÉTODO DE PAGO
    // =========================================
    const paymentLabel = paymentMethod === PaymentMethod.CASH ? 'EFECTIVO' :
                         paymentMethod === PaymentMethod.DEBIT ? 'TARJETA DÉBITO' :
                         'TARJETA CRÉDITO';
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Método: ${paymentLabel}`, 10, y);
    y += 6;

    const result = autoTable(doc, {
      startY: 48,
      head: [[
        'Product',
        'Cantidad',
        'Precio',
        'Subtotal'
      ]],

      body: items.map(item => [
        item.product.name,
        item.quantity,
        item.unitPrice,
        item.subtotal
      ])
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.text(`Recibido: $${recibido}`, 20, finalY + 30);

    doc.text(`Total: $${total}`, 20, finalY + 20);

    doc.text(`Cambio: $${cambio}`, 20, finalY + 40);

    doc.save(`venta-${saleId}.pdf`);
  }   
}