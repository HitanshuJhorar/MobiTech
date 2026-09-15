import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { Container } from '../components/ui/Container';
import { ProductCard, Product } from '../components/home/ProductCard';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Filter, X } from 'lucide-react';

const ALL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Ultra-Thin Clear MagSafe Case', category: 'cases', price: 1499, image: '/images/products/shop/shop-product-01-placeholder.svg' },
  { id: 'p2', name: 'Premium Leather Case Pro', category: 'cases', price: 2999, image: '/images/products/shop/shop-product-02-placeholder.svg' },
  { id: 'p3', name: 'Silicone Grip Cover', category: 'cases', price: 999, image: '/images/products/shop/shop-product-03-placeholder.svg' },
  { id: 'p4', name: 'Rugged Armor Shield', category: 'cases', price: 1999, image: '/images/products/shop/shop-product-04-placeholder.svg' },
  
  { id: 'p5', name: 'High-Fidelity Audio Earbuds', category: 'audio', price: 6499, image: '/images/products/shop/shop-product-05-placeholder.svg' },
  { id: 'p6', name: 'Noise-Canceling Over-Ear', category: 'audio', price: 12999, image: '/images/products/shop/shop-product-06-placeholder.svg' },
  { id: 'p7', name: 'Sports Wireless Neckband', category: 'audio', price: 2499, image: '/images/products/shop/shop-product-07-placeholder.svg' },
  
  { id: 'p8', name: 'Braided Nylon Type-C Cable', category: 'charging', price: 1299, image: '/images/products/shop/shop-product-08-placeholder.svg' },
  { id: 'p9', name: '65W GaN Fast Charger', category: 'charging', price: 2999, image: '/images/products/shop/shop-product-09-placeholder.svg' },
  { id: 'p10', name: 'Dual Port Car Charger', category: 'charging', price: 1499, image: '/images/products/shop/shop-product-10-placeholder.svg' },
  
  { id: 'p11', name: 'Compact 10000mAh Power Bank', category: 'power', price: 2999, image: '/images/products/shop/shop-product-11-placeholder.svg' },
  { id: 'p12', name: 'Magnetic Power Bank', category: 'power', price: 3499, image: '/images/products/shop/shop-product-12-placeholder.svg' },
  { id: 'p13', name: 'Pro 20000mAh Power Station', category: 'power', price: 4999, image: '/images/products/shop/shop-product-13-placeholder.svg' },
  
  { id: 'p14', name: 'Premium Phone Stand', category: 'smart-accessories', price: 1299, image: '/images/products/shop/shop-product-14-placeholder.svg' },
  { id: 'p15', name: 'MagSafe Wallet Attachment', category: 'smart-accessories', price: 1499, image: '/images/products/shop/shop-product-15-placeholder.svg' },
  
  { id: 'p16', name: 'Gaming TWS Earbuds', category: 'gaming', price: 4599, image: '/images/products/shop/shop-product-16-placeholder.svg' },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'cases', label: 'Phone Cases' },
  { id: 'audio', label: 'Audio' },
  { id: 'charging', label: 'Charging' },
  { id: 'power', label: 'Power' },
  { id: 'smart-accessories', label: 'Smart Accessories' },
  { id: 'gaming', label: 'Gaming' }
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const [sortOption, setSortOption] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Simple local filter (only category for Phase 3A)
  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS;
    if (currentCategory !== 'all') {
      result = result.filter(p => p.category === currentCategory);
    }
    return result;
  }, [currentCategory]);

  const handleCategoryChange = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const FilterSidebar = () => (
    <div className="space-y-10">
      <div>
        <h3 className="font-bold text-primary-dark mb-4 uppercase tracking-wider text-sm">Category</h3>
        <ul className="space-y-3">
          {CATEGORIES.slice(1).map((cat) => (
            <li key={cat.id}>
              <button 
                onClick={() => handleCategoryChange(cat.id)}
                className={`text-left w-full hover:text-primary-dark-teal transition-colors ${currentCategory === cat.id ? 'text-primary-dark-teal font-bold' : 'text-primary-dark/70'}`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-primary-dark mb-4 uppercase tracking-wider text-sm">Price</h3>
        <ul className="space-y-3 text-primary-dark/70">
          <li><button className="hover:text-primary-dark-teal">Under ₹1,000</button></li>
          <li><button className="hover:text-primary-dark-teal">₹1,000 – ₹2,500</button></li>
          <li><button className="hover:text-primary-dark-teal">₹2,500 – ₹5,000</button></li>
          <li><button className="hover:text-primary-dark-teal">Above ₹5,000</button></li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-primary-dark mb-4 uppercase tracking-wider text-sm">Availability</h3>
        <label className="flex items-center gap-3 text-primary-dark/70 cursor-pointer hover:text-primary-dark-teal">
          <input type="checkbox" className="rounded border-light-neutral text-primary-dark-teal focus:ring-primary-dark-teal" />
          <span>In Stock</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-soft-ivory">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <Container>
          {/* Header */}
          <div className="mb-12">
            <span className="text-caption text-primary-dark-teal tracking-widest mb-3 block">
              THE MOBITECH COLLECTION
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-dark mb-4">
              Shop Accessories
            </h1>
            <p className="text-body-large text-primary-dark/70 max-w-xl">
              Premium accessories designed for your everyday setup.
            </p>
          </div>

          {/* Horizontal Category Nav */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 pb-2 border-b border-light-neutral/50">
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  currentCategory === cat.id 
                    ? 'bg-primary-dark-teal text-white' 
                    : 'bg-white/50 text-primary-dark hover:bg-white border border-light-neutral/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-grow">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-light-neutral/50">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="lg:hidden flex items-center gap-2 bg-white"
                    onClick={() => setIsMobileFilterOpen(true)}
                  >
                    <Filter size={16} />
                    Filters
                  </Button>
                  <span className="text-primary-dark/60 text-sm">
                    {filteredProducts.length} products
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-primary-dark/60 hidden sm:inline">Sort by:</span>
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent border-none text-primary-dark font-medium text-sm focus:ring-0 cursor-pointer pr-8"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <h3 className="text-xl font-bold text-primary-dark mb-2">No products found</h3>
                  <p className="text-primary-dark/60">Try adjusting your filters or category selection.</p>
                  <Button 
                    variant="outline" 
                    className="mt-6 bg-white"
                    onClick={() => handleCategoryChange('all')}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination Placeholder */}
              {filteredProducts.length > 12 && (
                <div className="mt-16 flex justify-center">
                  <Button variant="outline" size="lg" className="bg-white px-12">
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer />

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-soft-ivory shadow-xl overflow-y-auto transform transition-transform border-l border-light-neutral">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-primary-dark">Filters</h2>
                <IconButton 
                  icon={X} 
                  variant="outline" 
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="bg-white border-transparent shadow-sm"
                />
              </div>
              <FilterSidebar />
              
              <div className="mt-12 pt-6 border-t border-light-neutral/50">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
