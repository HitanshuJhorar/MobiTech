import { Heart } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { formatPrice } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';

import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col relative group overflow-hidden bg-white/90 border border-light-neutral/60 h-full rounded-2xl">
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <IconButton 
          icon={Heart} 
          size="sm" 
          variant="solid" 
          aria-label="Add to wishlist" 
          className="text-primary-dark-teal/40 hover:text-red-500 hover:bg-white transition-colors"
        />
      </div>

      {/* Image Area */}
      <Link to={`/product/${product.id}`} className="relative aspect-square bg-soft-ivory/40 flex items-center justify-center p-6 block">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
          loading="lazy"
        />
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1.5">
          <span className="text-caption">{product.category}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-body-large font-bold text-primary-dark mb-2 line-clamp-2 hover:text-primary-dark-teal transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="text-price mb-5 mt-auto">
          {formatPrice(product.price)}
        </div>
        <Link to={`/product/${product.id}`} className="block w-full" tabIndex={-1}>
          <Button variant="primary" size="sm" className="w-full py-2.5">
            Quick View
          </Button>
        </Link>
      </div>
    </Card>
  );
}
