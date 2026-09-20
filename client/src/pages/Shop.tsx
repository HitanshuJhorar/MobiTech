import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';
import { Container } from '../components/ui/Container';
import { ProductCard } from '../components/home/ProductCard';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Filter, X, Loader2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const PRICE_RANGES = [
  { id: 'under-1000', label: 'Under ₹1,000', min: 0, max: 999 },
  { id: '1000-2500', label: '₹1,000 – ₹2,500', min: 1000, max: 2500 },
  { id: '2500-5000', label: '₹2,500 – ₹5,000', min: 2501, max: 5000 },
  { id: 'above-5000', label: 'Above ₹5,000', min: 5001, max: Infinity },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  
  // Local Filter State
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [page, setPage] = useState(1);
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  
  const formattedCategories = useMemo(() => {
    const defaultCat = { id: 'all', label: 'All', slug: 'all' };
    const apiCats = categories.map(c => ({ id: c.slug, label: c.name, slug: c.slug }));
    return [defaultCat, ...apiCats];
  }, [categories]);

  // Fetch Products
  const { data: paginatedData, isLoading: isLoadingProducts, isError } = useProducts({
    search: currentSearch || undefined,
    category: currentCategory !== 'all' ? currentCategory : undefined,
    sort: sortOption !== 'featured' ? sortOption : undefined,
    inStock: inStockOnly || undefined,
    page,
    limit: 50, // High limit to accommodate local price filtering for now
  });

  // Local Price Filtering (since backend does not support price ranges yet)
  const filteredProducts = useMemo(() => {
    let result = paginatedData?.products || [];

    if (selectedPriceRanges.length > 0) {
      result = result.filter(p => {
        return selectedPriceRanges.some(rangeId => {
          const range = PRICE_RANGES.find(r => r.id === rangeId);
          if (!range) return false;
          return p.price >= range.min && p.price <= range.max;
        });
      });
    }

    return result;
  }, [paginatedData?.products, selectedPriceRanges]);

  const activeFilterCount = (currentCategory !== 'all' ? 1 : 0) + selectedPriceRanges.length + (inStockOnly ? 1 : 0);

  const handleCategoryChange = (catId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams, { replace: true });
    setPage(1);
  };

  const clearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams, { replace: true });
    setPage(1);
  };

  const togglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeId) 
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    setSearchParams(newParams, { replace: true });
    
    setSelectedPriceRanges([]);
    setInStockOnly(false);
    setSortOption('featured');
    setPage(1);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-primary-dark mb-5 uppercase tracking-[0.1em] text-xs">Category</h3>
        <ul className="space-y-3.5">
          {isLoadingCategories ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-light-neutral rounded w-3/4"></div>
              <div className="h-4 bg-light-neutral rounded w-1/2"></div>
              <div className="h-4 bg-light-neutral rounded w-2/3"></div>
            </div>
          ) : (
            formattedCategories.slice(1).map((cat) => (
              <li key={cat.id} className="flex items-center">
                <button 
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`text-left w-full transition-colors flex items-center justify-between text-sm ${currentCategory === cat.id ? 'text-primary-dark-teal font-bold' : 'text-primary-dark/70 hover:text-primary-dark'}`}
                >
                  {cat.label}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-light-neutral/50 via-primary-dark-teal/10 to-transparent"></div>

      <div>
        <h3 className="font-bold text-primary-dark mb-5 uppercase tracking-[0.1em] text-xs">Price</h3>
        <ul className="space-y-3.5">
          {PRICE_RANGES.map(range => (
            <li key={range.id}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative flex items-center justify-center w-[18px] h-[18px] rounded-[5px] border transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${selectedPriceRanges.includes(range.id) ? 'border-transparent' : 'border-primary-dark-teal/30 bg-white group-hover:border-primary-dark-teal/60 group-hover:bg-primary-dark-teal/5'}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedPriceRanges.includes(range.id)}
                    onChange={() => togglePriceRange(range.id)}
                    className="opacity-0 absolute inset-0 cursor-pointer m-0 p-0 w-full h-full" 
                  />
                  <div className={`absolute inset-0 rounded-[4px] bg-gradient-to-br from-primary-dark-teal to-secondary-teal transition-all duration-200 ease-out ${selectedPriceRanges.includes(range.id) ? 'opacity-100 shadow-[0_2px_4px_rgba(20,83,86,0.2)]' : 'opacity-0'}`} />
                  <svg className={`relative z-10 w-3 h-3 text-white pointer-events-none transition-transform duration-200 ease-out ${selectedPriceRanges.includes(range.id) ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-sm text-primary-dark/80 group-hover:text-primary-dark transition-colors ${selectedPriceRanges.includes(range.id) ? 'font-semibold text-primary-dark' : ''}`}>
                  {range.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-light-neutral/50 via-primary-dark-teal/10 to-transparent"></div>

      <div>
        <h3 className="font-bold text-primary-dark mb-5 uppercase tracking-[0.1em] text-xs">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`relative flex items-center justify-center w-[18px] h-[18px] rounded-[5px] border transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${inStockOnly ? 'border-transparent' : 'border-primary-dark-teal/30 bg-white group-hover:border-primary-dark-teal/60 group-hover:bg-primary-dark-teal/5'}`}>
            <input 
              type="checkbox" 
              checked={inStockOnly}
              onChange={(e) => {
                setInStockOnly(e.target.checked);
                setPage(1);
              }}
              className="opacity-0 absolute inset-0 cursor-pointer m-0 p-0 w-full h-full" 
            />
            <div className={`absolute inset-0 rounded-[4px] bg-gradient-to-br from-primary-dark-teal to-secondary-teal transition-all duration-200 ease-out ${inStockOnly ? 'opacity-100 shadow-[0_2px_4px_rgba(20,83,86,0.2)]' : 'opacity-0'}`} />
            <svg className={`relative z-10 w-3 h-3 text-white pointer-events-none transition-transform duration-200 ease-out ${inStockOnly ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className={`text-sm text-primary-dark/80 group-hover:text-primary-dark transition-colors ${inStockOnly ? 'font-semibold text-primary-dark' : ''}`}>
            In Stock
          </span>
        </label>
      </div>

      {activeFilterCount > 0 && (
        <div className="pt-6">
          <button 
            onClick={clearAllFilters}
            className="text-primary-dark-teal text-sm font-semibold hover:text-primary-dark transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-soft-ivory via-soft-ivory to-primary-dark-teal/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-dark-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary-teal/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <Navbar />
      
      <main className="flex-grow pt-[120px] md:pt-[140px] pb-24 relative z-10">
        <Container>
          {/* Header */}
          <div className="mb-14 relative z-10">
            <div className="absolute -inset-8 bg-gradient-to-r from-primary-dark-teal/5 to-transparent blur-3xl -z-10 rounded-full" />
            {currentSearch ? (
              <>
                <span className="text-xs text-primary-dark-teal tracking-[0.2em] font-bold uppercase mb-4 block">
                  SEARCH RESULTS
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-dark mb-5">
                  Results for "{currentSearch}"
                </h1>
                <p className="text-body-large text-primary-dark/70 max-w-xl leading-relaxed">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} match your search.
                </p>
              </>
            ) : (
              <>
                <span className="text-xs text-primary-dark-teal tracking-[0.2em] font-bold uppercase mb-4 block">
                  THE MOBITECH COLLECTION
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-dark mb-5">
                  Shop Accessories
                </h1>
                <p className="text-body-large text-primary-dark/70 max-w-xl leading-relaxed">
                  Premium accessories designed for your everyday setup.
                </p>
              </>
            )}
          </div>

          {/* Horizontal Category Nav */}
          <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-4 border-b border-light-neutral/30">
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {formattedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-200 ease-out ${
                  currentCategory === cat.id 
                    ? 'bg-gradient-to-r from-primary-dark-teal to-secondary-teal text-white shadow-md hover:shadow-lg hover:-translate-y-[1px]' 
                    : 'bg-white/70 text-primary-dark hover:bg-white border border-light-neutral/50 hover:shadow-sm hover:-translate-y-[1px]'
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
                    className="lg:hidden flex items-center gap-2 bg-white relative"
                    onClick={() => setIsMobileFilterOpen(true)}
                  >
                    <Filter size={16} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-dark-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                  <div className="text-primary-dark/60 text-sm flex items-center gap-2">
                    <span className="font-bold text-primary-dark">{filteredProducts.length}</span> 
                    <span>{filteredProducts.length === 1 ? 'product' : 'products'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary-dark/60 uppercase tracking-widest hidden sm:inline">Sort by:</span>
                  <div className="relative group">
                    <select 
                      value={sortOption}
                      onChange={(e) => {
                        setSortOption(e.target.value);
                        setPage(1);
                      }}
                      className="appearance-none bg-gradient-to-r from-soft-ivory to-white border border-primary-dark-teal/20 rounded-[12px] pl-4 pr-10 py-2 text-primary-dark font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark-teal/20 focus:border-primary-dark-teal shadow-sm group-hover:border-primary-dark-teal/40 transition-all cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary-dark-teal/70 group-hover:text-primary-dark-teal transition-colors">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filter & Search Chips (Desktop) */}
              {(activeFilterCount > 0 || currentSearch) && (
                <div className="hidden lg:flex flex-wrap gap-2 mb-6">
                  {currentSearch && (
                    <span className="inline-flex items-center gap-1 bg-white border border-light-neutral px-3 py-1 rounded-full text-xs font-medium text-primary-dark">
                      Search: "{currentSearch}"
                      <button onClick={clearSearch} className="ml-1 hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {currentCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-white border border-light-neutral px-3 py-1 rounded-full text-xs font-medium text-primary-dark">
                      Category: {formattedCategories.find(c => c.id === currentCategory)?.label || currentCategory}
                      <button onClick={() => handleCategoryChange('all')} className="ml-1 hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedPriceRanges.map(rangeId => (
                    <span key={rangeId} className="inline-flex items-center gap-1 bg-white border border-light-neutral px-3 py-1 rounded-full text-xs font-medium text-primary-dark">
                      Price: {PRICE_RANGES.find(r => r.id === rangeId)?.label}
                      <button onClick={() => togglePriceRange(rangeId)} className="ml-1 hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1 bg-white border border-light-neutral px-3 py-1 rounded-full text-xs font-medium text-primary-dark">
                      In Stock Only
                      <button onClick={() => {
                        setInStockOnly(false);
                        setPage(1);
                      }} className="ml-1 hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {activeFilterCount > 0 && (
                    <button 
                      onClick={clearAllFilters}
                      className="text-xs text-primary-dark-teal font-medium hover:underline ml-2"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {/* Product Grid or States */}
              {isLoadingProducts ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary-dark-teal animate-spin mb-4" />
                  <p className="text-primary-dark/60">Loading products...</p>
                </div>
              ) : isError ? (
                <div className="py-20 text-center border border-dashed border-red-200 rounded-2xl bg-red-50/50">
                  <h3 className="text-xl font-bold text-red-600 mb-2">Unable to load products</h3>
                  <p className="text-red-600/70 mb-6">There was a problem connecting to the server.</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-light-neutral/80 rounded-2xl bg-white/50">
                  <h3 className="text-xl font-bold text-primary-dark mb-2">No products found {currentSearch && `for "${currentSearch}"`}</h3>
                  <p className="text-primary-dark/60 mb-6">Try a different search or adjust your filters.</p>
                  <div className="flex items-center justify-center gap-4">
                    {currentSearch && (
                      <Button variant="primary" onClick={clearSearch}>
                        Clear Search
                      </Button>
                    )}
                    {activeFilterCount > 0 && (
                      <Button variant={currentSearch ? "outline" : "primary"} onClick={clearAllFilters} className="bg-white">
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {paginatedData && paginatedData.pagination.totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-6">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${page === 1 ? 'opacity-50 cursor-not-allowed border border-light-neutral text-primary-dark/50' : 'border border-primary-dark-teal/30 text-primary-dark hover:bg-primary-dark-teal/10 hover:border-primary-dark-teal/60 hover:-translate-y-[1px]'}`}
                    aria-label="Previous page"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-dark-teal to-secondary-teal text-white text-sm font-bold shadow-md">
                      {page}
                    </div>
                    <span className="text-sm font-semibold text-primary-dark/50 uppercase tracking-widest">
                      of {paginatedData.pagination.totalPages}
                    </span>
                  </div>
                  <button 
                    disabled={page === paginatedData.pagination.totalPages}
                    onClick={() => setPage(p => Math.min(paginatedData.pagination.totalPages, p + 1))}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${page === paginatedData.pagination.totalPages ? 'opacity-50 cursor-not-allowed border border-light-neutral text-primary-dark/50' : 'border border-primary-dark-teal/30 text-primary-dark hover:bg-primary-dark-teal/10 hover:border-primary-dark-teal/60 hover:-translate-y-[1px]'}`}
                    aria-label="Next page"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
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
                <h2 className="text-lg font-bold text-primary-dark">Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</h2>
                <IconButton 
                  icon={X} 
                  variant="outline" 
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="bg-white border-transparent shadow-sm"
                />
              </div>
              <FilterSidebar />
              
              <div className="mt-12 pt-6 border-t border-light-neutral/50 sticky bottom-0 bg-soft-ivory pb-6">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Show {filteredProducts.length} Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
