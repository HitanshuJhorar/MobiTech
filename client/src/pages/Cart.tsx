import { Link } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { formatPrice } from '../utils/formatCurrency';
import { useCartStore } from '../store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col bg-soft-ivory">
      <Navbar />
      
      <main className="flex-grow pt-[120px] md:pt-[140px] pb-24">
        <Container>
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-primary-dark">
              Your Cart
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-light-neutral/80 rounded-3xl bg-white/50 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-dark-teal/40 mb-6 shadow-sm">
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-2xl font-bold text-primary-dark mb-3">Your cart is empty</h2>
              <p className="text-primary-dark/60 mb-8 max-w-sm">
                Looks like you haven't added anything yet. Explore our premium collection of accessories.
              </p>
              <Link to="/shop">
                <Button variant="primary" size="lg">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              {/* Cart Items List */}
              <div className="flex-grow flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-light-neutral/60 pb-4">
                  <span className="text-primary-dark/60 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                  <button onClick={clearCart} className="text-sm font-medium text-primary-dark/60 hover:text-red-500 transition-colors">
                    Clear Cart
                  </button>
                </div>
                
                {items.map((item) => (
                  <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-white rounded-2xl border border-light-neutral/40 shadow-sm relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-soft-ivory/50 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    
                    <div className="flex flex-col flex-grow w-full">
                      <div className="flex justify-between items-start mb-1 gap-4">
                        <Link to={`/product/${item.product.id}`} className="hover:text-primary-dark-teal transition-colors">
                          <h3 className="text-lg font-bold text-primary-dark leading-tight">{item.product.name}</h3>
                        </Link>
                        <div className="text-lg font-bold text-primary-dark whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-primary-dark/60 mb-4 uppercase tracking-wider text-xs font-bold">
                        {item.product.category.replace('-', ' ')}
                      </div>
                      
                      <div className="flex items-center justify-between w-full mt-auto">
                        <div className="flex items-center border border-light-neutral rounded-lg bg-soft-ivory/50 h-10">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            aria-label={`Decrease quantity for ${item.product.name}`}
                            className="w-10 flex items-center justify-center text-primary-dark hover:text-primary-dark-teal transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="w-8 text-center font-bold text-sm text-primary-dark select-none">
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            aria-label={`Increase quantity for ${item.product.name}`}
                            className="w-10 flex items-center justify-center text-primary-dark hover:text-primary-dark-teal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="text-sm text-primary-dark/50 hidden sm:block">
                          {formatPrice(item.product.price)} each
                        </div>

                        <IconButton 
                          icon={Trash2} 
                          size="sm" 
                          variant="ghost" 
                          aria-label={`Remove ${item.product.name}`}
                          onClick={() => removeItem(item.product.id)}
                          className="text-primary-dark/40 hover:text-red-500 hover:bg-red-50 ml-auto sm:ml-0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="bg-white rounded-3xl border border-light-neutral/60 p-8 shadow-sm sticky top-32">
                  <h2 className="text-xl font-bold text-primary-dark mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-primary-dark/70">
                      <span>Subtotal</span>
                      <span className="font-medium text-primary-dark">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-primary-dark/70">
                      <span>Shipping</span>
                      <span className="text-sm">Calculated on WhatsApp</span>
                    </div>
                    <div className="border-t border-light-neutral/60 pt-4 mt-4 flex justify-between items-center">
                      <span className="font-bold text-primary-dark">Total</span>
                      <span className="text-2xl font-bold text-primary-dark">{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button variant="primary" size="lg" className="w-full">
                      Order on WhatsApp
                    </Button>
                    <Link to="/shop" className="w-full">
                      <Button variant="outline" size="lg" className="w-full bg-transparent">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
