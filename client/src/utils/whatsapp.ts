import { CartItem } from '../store/cartStore';
import { formatPrice } from './formatCurrency';

export function createWhatsAppOrderMessage(items: CartItem[], subtotal: number): string {
  let message = "Hi Mobitech, I'd like to place an order:\n\n";
  
  items.forEach((item, index) => {
    const lineTotal = item.product.price * item.quantity;
    message += `${index + 1}. ${item.product.name} × ${item.quantity} — ${formatPrice(lineTotal)}\n`;
  });
  
  message += `\nSubtotal: ${formatPrice(subtotal)}\n\n`;
  message += "Please confirm availability and order details.";
  
  return message;
}

export function createWhatsAppOrderUrl(items: CartItem[], subtotal: number, phoneNumber: string): string {
  // Remove non-numeric characters for valid wa.me format
  const sanitizedNumber = phoneNumber.replace(/[^0-9]/g, '');
  const message = createWhatsAppOrderMessage(items, subtotal);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;
}
