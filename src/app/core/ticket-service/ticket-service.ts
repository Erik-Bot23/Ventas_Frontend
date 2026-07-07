import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  generateTicket(
    saleId: number,
    total: number,
    recibido: number,
    cambio: number,
    items: any[]
  ){
    const doc = new jsPDF();

    doc.setFontSize(16);

    doc.text(
      'Ticket de venta', 20, 20
    );

    doc.text(
      `Venta #${saleId}`, 20, 30
    );

    const result = autoTable(doc, {
      startY: 40,
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