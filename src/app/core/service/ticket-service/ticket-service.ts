import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { PaymentMethod } from '../../enums/paymentMethod';

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
    paymentMethod: PaymentMethod
  ){
    const doc = new jsPDF();

    doc.setFontSize(16);

    doc.text(
      'Ticket de venta', 20, 20
    );

    doc.text(
      `Venta #${saleId}`, 20, 30
    );

    const paymentLabel = paymentMethod === PaymentMethod.CASH ? 'Efectivo' :
                         paymentMethod === PaymentMethod.DEBIT ? 'Tarjeta de débito' :
                         'Tarjeta de crédito';
    
    doc.text(`Método de pago: ${paymentLabel}`, 20, 38);

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