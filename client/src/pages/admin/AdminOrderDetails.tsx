import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdminOrder, useOrderMutations } from '../../hooks/useOrders';
import { Button } from '../../components/ui/Button';
import { OrderStatusBadge, OrderStatusSelect } from '../../components/admin/OrderStatusBadge';
import { formatPrice } from '../../utils/formatCurrency';
import { isAxiosError } from 'axios';
import {
  ArrowLeft, Loader2, Phone, Mail, MessageCircle,
  User, ShoppingCart, FileText
} from 'lucide-react';
import { OrderStatus } from '../../services/orderService';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrderDetails() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, isError, error } = useAdminOrder(id);
  const { updateStatus, isUpdatingStatus } = useOrderMutations();

  const [pendingStatus, setPendingStatus] = useState<OrderStatus | ''>('');
  const [statusError, setStatusError] = useState('');

  const currentStatus = order?.status ?? 'pending';
  const selectedStatus = pendingStatus || currentStatus;

  const handleStatusUpdate = async () => {
    if (!pendingStatus || pendingStatus === currentStatus) return;
    setStatusError('');
    try {
      await updateStatus({ id, status: pendingStatus });
      setPendingStatus('');
    } catch (err) {
      if (isAxiosError(err)) {
        if (!err.response) {
          setStatusError('Network Error: Cannot connect to the server.');
        } else {
          setStatusError(err.response.data?.message || 'Failed to update status.');
        }
      } else {
        setStatusError('An unexpected error occurred.');
      }
    }
  };

  const isNotFound = isAxiosError(error) && error.response?.status === 404;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-dark-teal" />
      </div>
    );
  }

  if (isNotFound || isError) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <ShoppingCart size={48} className="mx-auto text-primary-dark/20" />
        <h3 className="text-xl font-bold text-primary-dark">Order not found</h3>
        <p className="text-primary-dark/60">This order may have been deleted or the link is invalid.</p>
        <Link to="/admin/orders">
          <Button variant="outline" className="mt-4">← Back to Orders</Button>
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={() => navigate('/admin/orders')}
          className="w-10 h-10 rounded-full bg-white border border-light-neutral flex items-center justify-center text-primary-dark hover:bg-light-neutral/30 transition-colors flex-shrink-0"
          aria-label="Back to orders"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-primary-dark font-mono">{order.orderNumber}</h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-primary-dark/50 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-light-neutral shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-light-neutral">
              <h3 className="font-bold text-primary-dark">Order Items</h3>
            </div>
            <div className="divide-y divide-light-neutral">
              {order.items.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-primary-dark truncate">{item.name}</div>
                    <div className="text-xs text-primary-dark/50 mt-0.5">
                      {formatPrice(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-primary-dark flex-shrink-0">
                    {formatPrice(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-light-neutral bg-soft-ivory/30 flex justify-between items-center">
              <span className="font-medium text-primary-dark/70">Subtotal</span>
              <span className="text-xl font-bold text-primary-dark">{formatPrice(order.subtotal)}</span>
            </div>
          </div>

          {/* Customer Note */}
          {order.customerNote && (
            <div className="bg-white rounded-2xl border border-light-neutral shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-primary-dark-teal" />
                <h3 className="font-bold text-primary-dark">Customer Note</h3>
              </div>
              <p className="text-primary-dark/70 text-sm leading-relaxed">{order.customerNote}</p>
            </div>
          )}
        </div>

        {/* Right column — sidebar panels */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-2xl border border-light-neutral shadow-sm p-6">
            <h3 className="font-bold text-primary-dark mb-4">Order Status</h3>
            <div className="space-y-4">
              <OrderStatusSelect
                value={selectedStatus as OrderStatus}
                onChange={(s) => setPendingStatus(s)}
                disabled={isUpdatingStatus}
              />
              {statusError && (
                <p className="text-sm text-red-600 font-medium">{statusError}</p>
              )}
              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleStatusUpdate}
                disabled={!pendingStatus || pendingStatus === currentStatus || isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <><Loader2 size={16} className="animate-spin" /> Updating…</>
                ) : (
                  'Update Status'
                )}
              </Button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-light-neutral shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-primary-dark-teal" />
              <h3 className="font-bold text-primary-dark">Customer</h3>
            </div>
            <div className="space-y-3">
              <div className="font-medium text-primary-dark">{order.customerName}</div>

              <a
                href={`tel:${order.customerPhone}`}
                className="flex items-center gap-2 text-sm text-primary-dark/70 hover:text-primary-dark-teal transition-colors"
              >
                <Phone size={14} className="flex-shrink-0" />
                {order.customerPhone}
              </a>

              {order.customerEmail && (
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="flex items-center gap-2 text-sm text-primary-dark/70 hover:text-primary-dark-teal transition-colors break-all"
                >
                  <Mail size={14} className="flex-shrink-0" />
                  {order.customerEmail}
                </a>
              )}
            </div>
          </div>

          {/* Source */}
          <div className="bg-white rounded-2xl border border-light-neutral shadow-sm p-6">
            <h3 className="font-bold text-primary-dark mb-3">Order Source</h3>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <MessageCircle size={14} />
              WhatsApp Enquiry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
