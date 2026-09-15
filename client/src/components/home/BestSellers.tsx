import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { IconButton } from '../ui/IconButton';
import { ProductCard, Product } from './ProductCard';

const bestSellers: Product[] = [
  { id: 'bs1', name: 'MagSafe Magnetic Case', category: 'Phone Cases', price: 1999, image: '/images/products/best-sellers/best-seller-01-placeholder.svg' },
  { id: 'bs2', name: '65W GaN Fast Charger', category: 'Premium Chargers', price: 2999, image: '/images/products/best-sellers/best-seller-02-placeholder.svg' },
  { id: 'bs3', name: 'Premium Wireless Earbuds', category: 'Audio', price: 8999, image: '/images/products/best-sellers/best-seller-03-placeholder.svg' },
  { id: 'bs4', name: 'Magnetic Power Bank', category: 'Power', price: 3499, image: '/images/products/best-sellers/best-seller-04-placeholder.svg' },
  { id: 'bs5', name: 'Braided USB-C Cable', category: 'Charging', price: 999, image: '/images/products/best-sellers/best-seller-05-placeholder.svg' },
  { id: 'bs6', name: 'MagSafe Wallet', category: 'Smart Accessories', price: 1499, image: '/images/products/best-sellers/best-seller-06-placeholder.svg' },
  { id: 'bs7', name: 'Premium Phone Stand', category: 'Smart Accessories', price: 1299, image: '/images/products/best-sellers/best-seller-07-placeholder.svg' },
  { id: 'bs8', name: 'Gaming TWS Earbuds', category: 'Gaming', price: 4599, image: '/images/products/best-sellers/best-seller-08-placeholder.svg' },
];

export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.9 : clientWidth * 0.9;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-soft-ivory">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <SectionHeading 
            title="Best Sellers" 
            subtitle="Customer favourites, chosen for everyday use." 
            className="mb-0" 
          />
          
          <div className="flex items-center gap-3 pb-2 sm:pb-0">
            <IconButton 
              icon={ChevronLeft} 
              variant="outline" 
              onClick={() => scroll('left')}
              aria-label="Previous products"
              className="bg-white hover:bg-white/90 border-primary-dark-teal/10 shadow-sm"
            />
            <IconButton 
              icon={ChevronRight} 
              variant="outline" 
              onClick={() => scroll('right')}
              aria-label="Next products"
              className="bg-white hover:bg-white/90 border-primary-dark-teal/10 shadow-sm"
            />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative -mx-4 sm:mx-0">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-0 pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Hide scrollbar for webkit */}
            <style>{`
              .flex::-webkit-scrollbar { display: none; }
            `}</style>
            
            {bestSellers.map((product) => (
              <div 
                key={product.id} 
                className="w-[85vw] sm:w-[calc(50%-10px)] md:w-[calc(33.333%-13.33px)] lg:w-[calc(25%-18px)] flex-none snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
