import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { IconButton } from '../ui/IconButton';
import { ProductCard } from './ProductCard';
import { useBestSellerProducts } from '../../hooks/useProducts';

export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: bestSellers = [], isLoading } = useBestSellerProducts();

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
              disabled={isLoading || bestSellers.length === 0}
            />
            <IconButton 
              icon={ChevronRight} 
              variant="outline" 
              onClick={() => scroll('right')}
              aria-label="Next products"
              className="bg-white hover:bg-white/90 border-primary-dark-teal/10 shadow-sm"
              disabled={isLoading || bestSellers.length === 0}
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
            
            {isLoading ? (
              <div className="w-full py-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-primary-dark-teal animate-spin" />
              </div>
            ) : bestSellers.length > 0 ? (
              bestSellers.map((product) => (
                <div 
                  key={product.id} 
                  className="w-[85vw] sm:w-[calc(50%-10px)] md:w-[calc(33.333%-13.33px)] lg:w-[calc(25%-18px)] flex-none snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="w-full py-12 text-center text-primary-dark/50">
                No best sellers available.
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
