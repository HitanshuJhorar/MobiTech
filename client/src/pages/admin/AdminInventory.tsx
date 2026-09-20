import { useState, FormEvent } from 'react';
import { useInventory, useLowStock } from '../../hooks/useInventory';
import { Button } from '../../components/ui/Button';
import { StockUpdateModal } from '../../components/admin/StockUpdateModal';
import { InventoryProduct } from '../../services/inventoryService';
import { Search, Filter, X, Loader2, Package, AlertTriangle } from 'lucide-react';

const LOW_STOCK_THRESHOLD = 5;

function getStockStatus(qty: number, threshold: number) {
  if (qty === 0) return 'out-of-stock' as const;
  if (qty <= threshold) return 'low' as const;
  return 'in-stock' as const;
}

function StockBadge({ qty, threshold }: { qty: number; threshold: number }) {
  const status = getStockStatus(qty, threshold);
  if (status === 'out-of-stock') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
        Out of Stock
      </span>
    );
  }
  if (status === 'low') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
        <AlertTriangle size={11} className="flex-shrink-0" />
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
      In Stock
    </span>
  );
}

export default function AdminInventory() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stockStatus, setStockStatus] = useState<'all' | 'in-stock' | 'out-of-stock' | 'low-stock'>('all');
  const [productStatus, setProductStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);

  // Map UI stock filter to backend params
  const backendStatus = stockStatus === 'low-stock' ? 'all' : stockStatus;

  const { data, isLoading, isError } = useInventory({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: backendStatus !== 'all' ? backendStatus : undefined,
    productStatus: productStatus !== 'all' ? productStatus : undefined,
  });

  // Low-stock for summary card only – no extra per-row requests
  const { data: lowStockData } = useLowStock(LOW_STOCK_THRESHOLD);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStockStatus('all');
    setProductStatus('all');
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch !== '' || stockStatus !== 'all' || productStatus !== 'all';

  // Client-side low-stock filter (backend doesn't support low-stock range query in list endpoint)
  const displayedProducts =
    stockStatus === 'low-stock'
      ? (data?.products ?? []).filter(p => p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK_THRESHOLD)
      : (data?.products ?? []);

  // Summary stats derived from current page data (not global — only what backend returned)
  const pageStats = data
    ? {
        total: data.pagination.total,
        inStock: data.products.filter(p => p.inStock).length,
        lowStock: lowStockData?.products.length ?? '–',
        outOfStock: data.products.filter(p => !p.inStock).length,
      }
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-dark mb-1">Inventory</h2>
        <p className="text-primary-dark/60 text-sm">Monitor stock levels and update product inventory.</p>
      </div>

      {/* Summary Cards */}
      {pageStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: pageStats.total, color: 'text-primary-dark' },
            { label: 'In Stock (this page)', value: pageStats.inStock, color: 'text-primary-dark-teal' },
            { label: 'Low Stock (≤5)', value: pageStats.lowStock, color: 'text-amber-600' },
            { label: 'Out of Stock (this page)', value: pageStats.outOfStock, color: 'text-red-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-light-neutral shadow-sm p-5 flex flex-col gap-1">
              <span className="text-xs font-medium text-primary-dark/50 uppercase tracking-wide">{stat.label}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-light-neutral shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark/40" size={18} />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm"
            />
          </div>
          <Button type="submit" variant="outline" className="bg-white">Search</Button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-primary-dark/40" />
            <span className="text-sm font-medium text-primary-dark/60">Filters:</span>
          </div>

          <select
            value={stockStatus}
            onChange={(e) => { setStockStatus(e.target.value as typeof stockStatus); setPage(1); }}
            className="text-sm border border-light-neutral rounded-md px-3 py-1.5 outline-none focus:border-primary-dark-teal"
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            value={productStatus}
            onChange={(e) => { setProductStatus(e.target.value as 'all' | 'active' | 'inactive'); setPage(1); }}
            className="text-sm border border-light-neutral rounded-md px-3 py-1.5 outline-none focus:border-primary-dark-teal"
          >
            <option value="all">All Products</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary-dark-teal hover:underline flex items-center gap-1"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-xl border border-light-neutral shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-dark-teal" />
          </div>
        ) : isError || !data ? (
          <div className="py-12 text-center text-red-600 font-medium">Failed to load inventory. Please try again.</div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Package size={40} className="text-primary-dark/20" />
            <p className="text-primary-dark/60 font-medium">No products found.</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-soft-ivory/50 border-b border-light-neutral text-xs uppercase tracking-wider text-primary-dark/60">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium">Stock Status</th>
                    <th className="px-6 py-4 font-medium">Product Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-neutral text-sm">
                  {displayedProducts.map(product => {
                    const catName = typeof product.category === 'object' && product.category !== null && 'name' in product.category
                      ? product.category.name : String(product.category);
                    const imageSrc = product.images?.[0] || '/images/admin/product-placeholder.svg';

                    return (
                      <tr key={product._id} className="hover:bg-soft-ivory/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-lg bg-soft-ivory border border-light-neutral flex items-center justify-center overflow-hidden flex-shrink-0">
                              <img src={imageSrc} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div>
                              <div className="font-bold text-primary-dark">{product.name}</div>
                              <div className="text-xs text-primary-dark/50 font-mono mt-0.5">{product.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-primary-dark/80 font-medium">{catName}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xl font-bold ${product.stockQuantity === 0 ? 'text-red-600' : product.stockQuantity <= LOW_STOCK_THRESHOLD ? 'text-amber-600' : 'text-primary-dark'}`}>
                            {product.stockQuantity}
                          </span>
                          <span className="text-xs text-primary-dark/50 ml-1.5">units</span>
                        </td>
                        <td className="px-6 py-4">
                          <StockBadge qty={product.stockQuantity} threshold={LOW_STOCK_THRESHOLD} />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-light-neutral text-primary-dark/60'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white text-xs"
                              onClick={() => setSelectedProduct(product)}
                            >
                              Update Stock
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-light-neutral">
              {displayedProducts.map(product => {
                const catName = typeof product.category === 'object' && product.category !== null && 'name' in product.category
                  ? product.category.name : String(product.category);
                const imageSrc = product.images?.[0] || '/images/admin/product-placeholder.svg';

                return (
                  <div key={product._id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-soft-ivory border border-light-neutral flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={imageSrc} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-primary-dark truncate">{product.name}</div>
                        <div className="text-xs text-primary-dark/60 mt-0.5">{catName}</div>
                        <div className="text-xs font-mono text-primary-dark/40 mt-0.5">{product.slug}</div>
                      </div>
                    </div>

                    <div className="bg-soft-ivory/30 rounded-lg p-3 border border-light-neutral/50 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-xs text-primary-dark/50 block mb-0.5">Stock</span>
                          <span className={`text-xl font-bold ${product.stockQuantity === 0 ? 'text-red-600' : product.stockQuantity <= LOW_STOCK_THRESHOLD ? 'text-amber-600' : 'text-primary-dark'}`}>
                            {product.stockQuantity}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <StockBadge qty={product.stockQuantity} threshold={LOW_STOCK_THRESHOLD} />
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-light-neutral text-primary-dark/60'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-xs"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Update Stock
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="p-4 border-t border-light-neutral bg-soft-ivory/30 flex items-center justify-between">
            <span className="text-sm text-primary-dark/60">
              Page {page} of {data.pagination.totalPages} ({data.pagination.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-white">
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))} disabled={page === data.pagination.totalPages} className="bg-white">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stock Update Modal */}
      {selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
