import { Heart } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatPrice } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';

import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col relative group overflow-hidden bg-gradient-to-b from-white to-soft-ivory/30 border border-primary-dark-teal/5 h-full rounded-[20px] shadow-sm hover:shadow-lg hover:shadow-primary-dark-teal/5 hover:-translate-y-1 hover:border-primary-dark-teal/20 transition-all duration-300 ease-out">
      
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-20">
        <button 
          aria-label="Add to wishlist" 
          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-light-neutral/50 flex items-center justify-center text-primary-dark-teal transition-all duration-200 hover:bg-primary-dark-teal/10 hover:border-primary-dark-teal/30 hover:shadow-sm group/heart"
        >
          <Heart size={16} strokeWidth={2} className="transition-transform duration-200 group-hover/heart:scale-110" />
        </button>
      </div>

      {/* Stock Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-soft-ivory to-white border border-primary-dark-teal/10 shadow-sm backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-dark-teal animate-pulse"></div>
          <span className="text-[10px] font-bold text-primary-dark uppercase tracking-wider">In Stock</span>
        </div>
      </div>

      {/* Image Area */}
      <Link to={`/product/${product.id}`} className="relative w-full aspect-square bg-gradient-to-br from-white via-soft-ivory to-primary-dark-teal/5 flex items-center justify-center p-8 block overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,83,86,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] mix-blend-multiply relative z-10"
          loading="lazy"
        />
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow bg-white/40">
        <div className="mb-2">
          <span className="text-[11px] font-bold text-primary-dark-teal/70 uppercase tracking-widest">{product.category}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-base font-semibold text-primary-dark leading-snug line-clamp-2 group-hover:text-primary-dark-teal transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto mb-4 flex items-end gap-2">
          <span className="text-lg font-bold text-primary-dark-teal">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <Link to={`/product/${product.id}`} className="block w-full" tabIndex={-1}>
          <button className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary-dark via-primary-dark-teal to-secondary-teal transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary-dark-teal/20 hover:-translate-y-[1px] active:scale-[0.98]">
            Quick View
          </button>
        </Link>
      </div>
    </Card>
  );
}
