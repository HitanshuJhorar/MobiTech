import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { IconButton } from '../ui/IconButton';
import { ProductCard, Product } from './ProductCard';

const featuredProducts: Product[] = [
  { id: '1', name: 'Premium Leather Phone Case', category: 'Cases Collection', price: 2999, image: '/images/products/featured-product-01-placeholder.svg' },
  { id: '2', name: 'Noise-Canceling Wireless Earbuds', category: 'Audio Series', price: 8999, image: '/images/products/featured-product-02-placeholder.svg' },
  { id: '3', name: 'Braided Lightning Cable', category: 'Power Essentials', price: 1499, image: '/images/products/featured-product-03-placeholder.svg' },
  { id: '4', name: 'MagSafe Wireless Power Bank', category: 'Power Essentials', price: 4599, image: '/images/products/featured-product-04-placeholder.svg' },
  { id: '5', name: 'Over-Ear Premium Headphones', category: 'Audio Series', price: 12999, image: '/images/products/featured-product-05-placeholder.svg' },
  { id: '6', name: 'Smartwatch Silicone Band', category: 'Wearables', price: 999, image: '/images/products/featured-product-06-placeholder.svg' },
];

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll by the width of the container minus a small peek offset
      const scrollAmount = direction === 'left' ? -clientWidth * 0.9 : clientWidth * 0.9;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-soft-ivory">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <SectionHeading title="Featured Collection" className="mb-0" />
          
          <div className="flex items-center gap-3">
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
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0 pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Hide scrollbar for webkit */}
            <style>{`
              .flex::-webkit-scrollbar { display: none; }
            `}</style>
            
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-21.33px)] flex-none snap-start"
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
