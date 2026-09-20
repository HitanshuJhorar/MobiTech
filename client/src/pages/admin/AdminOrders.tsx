import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/useOrders';
import { Button } from '../../components/ui/Button';
import { OrderStatusBadge } from '../../components/admin/OrderStatusBadge';
import { formatPrice } from '../../utils/formatCurrency';
import { Search, Filter, X, Loader2, ShoppingCart, MessageCircle, Eye } from 'lucide-react';
import { OrderStatus } from '../../services/orderService';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<'' | OrderStatus>('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const { data, isLoading, isError } = useAdminOrders({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: status || undefined,
    sort,
  });

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch !== '' || status !== '' || sort !== 'newest';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary-dark mb-1">Orders</h2>
        <p className="text-primary-dark/60 text-sm">Manage customer enquiries and WhatsApp orders.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-light-neutral shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark/40" size={18} />
            <input
              type="text"
              placeholder="Search by order number, name or phone..."
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
            value={status}
            onChange={(e) => { setStatus(e.target.value as '' | OrderStatus); setPage(1); }}
            className="text-sm border border-light-neutral rounded-md px-3 py-1.5 outline-none focus:border-primary-dark-teal"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as 'newest' | 'oldest'); setPage(1); }}
            className="text-sm border border-light-neutral rounded-md px-3 py-1.5 outline-none focus:border-primary-dark-teal"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
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

      {/* Orders List */}
      <div className="bg-white rounded-xl border border-light-neutral shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-dark-teal" />
          </div>
        ) : isError || !data ? (
          <div className="py-12 text-center text-red-600 font-medium">Failed to load orders. Please try again.</div>
        ) : data.orders.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <ShoppingCart size={40} className="text-primary-dark/20" />
            <p className="text-primary-dark/60 font-medium">No orders found.</p>
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
                    <th className="px-6 py-4 font-medium">Order</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Source</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-neutral text-sm">
                  {data.orders.map(order => (
                    <tr key={order._id} className="hover:bg-soft-ivory/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary-dark font-mono text-sm">{order.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-primary-dark">{order.customerName}</div>
                        <div className="text-xs text-primary-dark/50 mt-0.5">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                          <MessageCircle size={12} />
                          WhatsApp
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary-dark">
                        {formatPrice(order.subtotal)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-primary-dark/60 text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <Link to={`/admin/orders/${order._id}`}>
                            <Button variant="outline" size="sm" className="bg-white text-xs flex items-center gap-1.5">
                              <Eye size={14} />
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-light-neutral">
              {data.orders.map(order => (
                <div key={order._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-primary-dark font-mono text-sm">{order.orderNumber}</div>
                      <div className="font-medium text-primary-dark mt-0.5">{order.customerName}</div>
                      <div className="text-xs text-primary-dark/50">{order.customerPhone}</div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="bg-soft-ivory/30 rounded-lg p-3 border border-light-neutral/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-xs text-primary-dark/50 block mb-0.5">Total</span>
                        <span className="font-bold text-primary-dark">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-primary-dark/50 block mb-0.5">Date</span>
                        <span className="text-sm text-primary-dark/80">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <Link to={`/admin/orders/${order._id}`}>
                      <Button variant="outline" size="sm" className="bg-white text-xs flex items-center gap-1.5">
                        <Eye size={14} /> View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
