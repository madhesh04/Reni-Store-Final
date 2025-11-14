import jsPDF from 'jspdf';
import { Order } from '../types';

export const generateInvoice = (order: Order): string => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Professional Colors
  const black = [0, 0, 0];
  const darkGray = [64, 64, 64];
  const lightGray = [245, 245, 245];
  const borderGray = [200, 200, 200];
  
  // Header Section with Logo Area
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Company Logo
  try {
    doc.addImage('/assets/renis-logo.png', 'PNG', 20, 15, 60, 30);
  } catch (error) {
    // Fallback to text if logo fails to load
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('RENIS', 20, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('premium comfort.', 20, 40);
    doc.setFontSize(9);
    doc.text('Since 2018', 20, 50);
  }
  
  // Invoice Title & Details Box
  doc.setFillColor(black[0], black[1], black[2]);
  doc.rect(130, 15, 70, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 135, 28);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const orderDate = new Date(order.createdAt);
  doc.text(`Invoice #: ${order.id}`, 135, 36);
  doc.text(`Reference: ${order.id}`, 135, 42);
  doc.text(`Date: ${orderDate.toLocaleDateString()}`, 135, 48);
  
  // Company & Customer Info Section
  doc.setTextColor(black[0], black[1], black[2]);
  
  // From Section
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.rect(20, 70, 80, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM:', 25, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('RENIS STORE', 25, 88);
  doc.text('Premium Comfort Solutions', 25, 94);
  doc.text('madheshp42@gmail.com', 25, 100);
  doc.text('+1 (234) 567-890', 25, 106);
  
  // To Section
  doc.rect(110, 70, 80, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 115, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(order.customer.customerName, 115, 88);
  doc.text(order.customer.phoneNumber, 115, 94);
  
  const addressLines = doc.splitTextToSize(order.customer.address, 70);
  let addressY = 100;
  addressLines.forEach((line: string) => {
    doc.text(line, 115, addressY);
    addressY += 6;
  });
  
  // Items Table
  let tableY = 130;
  
  // Table Header
  doc.setFillColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.rect(20, tableY, 170, 15, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.rect(20, tableY, 170, 15);
  
  // Column borders
  doc.line(70, tableY, 70, tableY + 15); // Item | Size
  doc.line(95, tableY, 95, tableY + 15); // Size | Color
  doc.line(120, tableY, 120, tableY + 15); // Color | Qty
  doc.line(140, tableY, 140, tableY + 15); // Qty | Price
  doc.line(165, tableY, 165, tableY + 15); // Price | Total
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM DESCRIPTION', 25, tableY + 9);
  doc.text('SIZE', 75, tableY + 9);
  doc.text('COLOR', 98, tableY + 9);
  doc.text('QTY', 125, tableY + 9);
  doc.text('PRICE', 143, tableY + 9);
  doc.text('TOTAL', 168, tableY + 9);
  
  tableY += 15;
  
  // Table Rows
  doc.setTextColor(black[0], black[1], black[2]);
  doc.setFont('helvetica', 'normal');
  
  order.items.forEach((item, index) => {
    const rowHeight = 12;
    
    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, tableY, 170, rowHeight, 'F');
    }
    
    // Row borders
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.rect(20, tableY, 170, rowHeight);
    doc.line(70, tableY, 70, tableY + rowHeight);
    doc.line(95, tableY, 95, tableY + rowHeight);
    doc.line(120, tableY, 120, tableY + rowHeight);
    doc.line(140, tableY, 140, tableY + rowHeight);
    doc.line(165, tableY, 165, tableY + rowHeight);
    
    // Item data
    const itemName = doc.splitTextToSize(item.name, 45);
    doc.text(itemName[0], 25, tableY + 8);
    doc.text(item.size, 75, tableY + 8);
    doc.text(item.color, 98, tableY + 8);
    doc.text(item.quantity.toString(), 125, tableY + 8);
    doc.text(`$${item.price.toFixed(2)}`, 143, tableY + 8);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 168, tableY + 8);
    
    tableY += rowHeight;
  });
  
  // Totals Section
  tableY += 20;
  
  // Totals Box
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.rect(120, tableY, 70, 30);
  
  doc.setFontSize(9);
  doc.text('Subtotal:', 125, tableY + 8);
  doc.text(`$${order.total.toFixed(2)}`, 175, tableY + 8);
  
  doc.text('Tax (0%):', 125, tableY + 16);
  doc.text('$0.00', 175, tableY + 16);
  
  doc.line(125, tableY + 20, 185, tableY + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL:', 125, tableY + 28);
  doc.text(`$${order.total.toFixed(2)}`, 175, tableY + 28);
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Thank you for choosing Renis Store - Premium Comfort Since 2018', 20, pageHeight - 20);
  doc.text(`Generated on: ${new Date().toLocaleString()} | Reference: ${order.id}`, 20, pageHeight - 12);
  doc.text('For support: madheshp42@gmail.com | Visit: renis-store.com', 20, pageHeight - 4);
  
  return doc.output('datauristring');
};

export const downloadInvoice = (order: Order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Professional Colors
  const black = [0, 0, 0];
  const darkGray = [64, 64, 64];
  const lightGray = [245, 245, 245];
  const borderGray = [200, 200, 200];
  
  // Header Section with Logo Area
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Company Logo
  try {
    doc.addImage('/assets/renis-logo.png', 'PNG', 20, 15, 60, 30);
  } catch (error) {
    // Fallback to text if logo fails to load
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('RENIS', 20, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('premium comfort.', 20, 40);
    doc.setFontSize(9);
    doc.text('Since 2018', 20, 50);
  }
  
  // Invoice Title & Details Box
  doc.setFillColor(black[0], black[1], black[2]);
  doc.rect(130, 15, 70, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 135, 28);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const orderDate = new Date(order.createdAt);
  doc.text(`Invoice #: ${order.id}`, 135, 36);
  doc.text(`Reference: ${order.id}`, 135, 42);
  doc.text(`Date: ${orderDate.toLocaleDateString()}`, 135, 48);
  
  // Company & Customer Info Section
  doc.setTextColor(black[0], black[1], black[2]);
  
  // From Section
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.rect(20, 70, 80, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM:', 25, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('RENIS STORE', 25, 88);
  doc.text('Premium Comfort Solutions', 25, 94);
  doc.text('madheshp42@gmail.com', 25, 100);
  doc.text('+1 (234) 567-890', 25, 106);
  
  // To Section
  doc.rect(110, 70, 80, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 115, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(order.customer.customerName, 115, 88);
  doc.text(order.customer.phoneNumber, 115, 94);
  
  const addressLines = doc.splitTextToSize(order.customer.address, 70);
  let addressY = 100;
  addressLines.forEach((line: string) => {
    doc.text(line, 115, addressY);
    addressY += 6;
  });
  
  // Items Table
  let tableY = 130;
  
  // Table Header
  doc.setFillColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.rect(20, tableY, 170, 15, 'F');
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.rect(20, tableY, 170, 15);
  
  // Column borders
  doc.line(70, tableY, 70, tableY + 15); // Item | Size
  doc.line(95, tableY, 95, tableY + 15); // Size | Color
  doc.line(120, tableY, 120, tableY + 15); // Color | Qty
  doc.line(140, tableY, 140, tableY + 15); // Qty | Price
  doc.line(165, tableY, 165, tableY + 15); // Price | Total
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM DESCRIPTION', 25, tableY + 9);
  doc.text('SIZE', 75, tableY + 9);
  doc.text('COLOR', 98, tableY + 9);
  doc.text('QTY', 125, tableY + 9);
  doc.text('PRICE', 143, tableY + 9);
  doc.text('TOTAL', 168, tableY + 9);
  
  tableY += 15;
  
  // Table Rows
  doc.setTextColor(black[0], black[1], black[2]);
  doc.setFont('helvetica', 'normal');
  
  order.items.forEach((item, index) => {
    const rowHeight = 12;
    
    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, tableY, 170, rowHeight, 'F');
    }
    
    // Row borders
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.rect(20, tableY, 170, rowHeight);
    doc.line(70, tableY, 70, tableY + rowHeight);
    doc.line(95, tableY, 95, tableY + rowHeight);
    doc.line(120, tableY, 120, tableY + rowHeight);
    doc.line(140, tableY, 140, tableY + rowHeight);
    doc.line(165, tableY, 165, tableY + rowHeight);
    
    // Item data
    const itemName = doc.splitTextToSize(item.name, 45);
    doc.text(itemName[0], 25, tableY + 8);
    doc.text(item.size, 75, tableY + 8);
    doc.text(item.color, 98, tableY + 8);
    doc.text(item.quantity.toString(), 125, tableY + 8);
    doc.text(`$${item.price.toFixed(2)}`, 143, tableY + 8);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 168, tableY + 8);
    
    tableY += rowHeight;
  });
  
  // Totals Section
  tableY += 20;
  
  // Totals Box
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.rect(120, tableY, 70, 30);
  
  doc.setFontSize(9);
  doc.text('Subtotal:', 125, tableY + 8);
  doc.text(`$${order.total.toFixed(2)}`, 175, tableY + 8);
  
  doc.text('Tax (0%):', 125, tableY + 16);
  doc.text('$0.00', 175, tableY + 16);
  
  doc.line(125, tableY + 20, 185, tableY + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL:', 125, tableY + 28);
  doc.text(`$${order.total.toFixed(2)}`, 175, tableY + 28);
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Thank you for choosing Renis Store - Premium Comfort Since 2018', 20, pageHeight - 20);
  doc.text(`Generated on: ${new Date().toLocaleString()} | Reference: ${order.id}`, 20, pageHeight - 12);
  doc.text('For support: madheshp42@gmail.com | Visit: renis-store.com', 20, pageHeight - 4);
  
  doc.save(`invoice-${order.id}.pdf`);
};