import { CartItem } from '../store/cartStore';
import { formatPrice } from './formatCurrency';

export function createWhatsAppOrderMessage(
  orderNumber: string,
  items: CartItem[], 
  subtotal: number, 
  customerName: string, 
  customerPhone: string, 
  customerNote?: string
): string {
  let message = `Hello Mobitech,\n\nI'd like to place an order.\n\n`;
  message += `Order: ${orderNumber}\n\nItems:\n`;
  
  items.forEach((item) => {
    message += `- ${item.product.name} x ${item.quantity}\n`;
  });
  
  message += `\nSubtotal: ${formatPrice(subtotal)}\n\n`;
  message += `Customer:\nName: ${customerName}\nPhone: ${customerPhone}\n`;
  
  if (customerNote) {
    message += `\nNote:\n${customerNote}\n`;
  }
  
  message += `\nPlease confirm my order.`;
  
  return message;
}

export function createWhatsAppOrderUrl(
  orderNumber: string,
  items: CartItem[], 
  subtotal: number, 
  customerName: string, 
  customerPhone: string, 
  customerNote: string | undefined,
  destinationPhoneNumber: string
): string {
  const sanitizedNumber = destinationPhoneNumber.replace(/[^0-9]/g, '');
  const message = createWhatsAppOrderMessage(orderNumber, items, subtotal, customerName, customerPhone, customerNote);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;
}
