import { OrderStatus } from '../../services/orderService';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-sand/40 text-amber-800 border border-sand',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-primary-dark-teal/10 text-primary-dark-teal border border-primary-dark-teal/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-700 border border-red-100',
  },
  completed: {
    label: 'Completed',
    className: 'bg-primary-dark/10 text-primary-dark border border-primary-dark/20',
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${config.className}`}>
      {config.label}
    </span>
  );
}

export function OrderStatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
}) {
  const statuses: OrderStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-primary-dark/60 uppercase tracking-wide">
        Update Status
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        disabled={disabled}
        className="text-sm border border-light-neutral rounded-lg px-3 py-2 outline-none focus:border-primary-dark-teal bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Order status"
      >
        {statuses.map(s => (
          <option key={s} value={s}>
            {STATUS_CONFIG[s].label}
          </option>
        ))}
      </select>
    </div>
  );
}
