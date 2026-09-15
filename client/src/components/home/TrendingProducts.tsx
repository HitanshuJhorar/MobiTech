import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { IconButton } from '../ui/IconButton';
import { ProductCard, Product } from './ProductCard';

const trendingProducts: Product[] = [
  { id: 't1', name: 'Ultra-Thin Clear MagSafe Case', category: 'MagSafe Accessories', price: 1999, image: '/images/products/trending/trending-product-01-placeholder.svg' },
  { id: 't2', name: 'High-Fidelity Audio Earbuds', category: 'Wireless Audio', price: 6499, image: '/images/products/trending/trending-product-02-placeholder.svg' },
  { id: 't3', name: 'Braided Nylon Type-C Cable', category: 'Premium Chargers', price: 1299, image: '/images/products/trending/trending-product-03-placeholder.svg' },
  { id: 't4', name: 'Dual Device Charging Pad', category: 'Wireless Essentials', price: 3499, image: '/images/products/trending/trending-product-04-placeholder.svg' },
  { id: 't5', name: 'Premium Leather Watch Band', category: 'Gaming Essentials', price: 2199, image: '/images/products/trending/trending-product-05-placeholder.svg' },
  { id: 't6', name: 'Compact 10000mAh Power Bank', category: 'Power Essentials', price: 2999, image: '/images/products/trending/trending-product-06-placeholder.svg' },
  { id: 't7', name: 'Car Mount MagSafe Charger', category: 'MagSafe Accessories', price: 2499, image: '/images/products/trending/trending-product-07-placeholder.svg' },
  { id: 't8', name: 'Over-Ear Studio Headphones', category: 'Wireless Audio', price: 11999, image: '/images/products/trending/trending-product-08-placeholder.svg' },
];

export function TrendingProducts() {
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
          <SectionHeading title="Trending Accessories" className="mb-0" />
          
          <div className="flex items-center gap-3">
            <IconButton 
              icon={ChevronLeft} 
              variant="outline" 
              onClick={() => scroll('left')}
              aria-label="Previous trending products"
              className="bg-white hover:bg-white/90 border-primary-dark-teal/10 shadow-sm"
            />
            <IconButton 
              icon={ChevronRight} 
              variant="outline" 
              onClick={() => scroll('right')}
              aria-label="Next trending products"
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
            
            {trendingProducts.map((product) => (
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
