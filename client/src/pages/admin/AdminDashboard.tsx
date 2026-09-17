import { useQuery } from '@tanstack/react-query';
import { Package, Tag, AlertTriangle, ShoppingCart, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const fetchDashboardData = async () => {
    const [productsRes, categoriesRes, ordersRes, lowStockRes] = await Promise.all([
      api.get('/products?limit=1'), // limit=1 is enough to get pagination.total
      api.get('/categories'),
      api.get('/orders?limit=1'),
      api.get('/inventory/low-stock?threshold=5'),
    ]);

    return {
      totalProducts: productsRes.data.data.pagination.total || 0,
      totalCategories: categoriesRes.data.data.length || 0,
      totalOrders: ordersRes.data.data.pagination.total || 0,
      lowStockCount: lowStockRes.data.data.products.length || 0,
    };
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboardOverview'],
    queryFn: fetchDashboardData,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-dark-teal" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100">
        <h3 className="font-bold mb-2">Error loading dashboard</h3>
        <p>Could not fetch overview statistics. Please try again.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Active Products',
      value: data.totalProducts,
      icon: Package,
      color: 'bg-primary-dark-teal',
      textColor: 'text-primary-dark-teal',
    },
    {
      title: 'Categories',
      value: data.totalCategories,
      icon: Tag,
      color: 'bg-secondary-teal',
      textColor: 'text-secondary-teal',
    },
    {
      title: 'Low Stock Alerts',
      value: data.lowStockCount,
      icon: AlertTriangle,
      color: 'bg-sand',
      textColor: 'text-amber-600',
    },
    {
      title: 'Total Orders',
      value: data.totalOrders,
      icon: ShoppingCart,
      color: 'bg-primary-dark',
      textColor: 'text-primary-dark',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark mb-2">Overview</h2>
        <p className="text-primary-dark/60">A quick summary of your store's current status.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-light-neutral shadow-sm flex items-center gap-5"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-soft-ivory`}>
                <Icon size={24} className={stat.textColor} />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-dark/60 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-primary-dark">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for future modules */}
      <div className="mt-12 bg-white rounded-2xl border border-light-neutral p-8 shadow-sm">
        <h3 className="text-lg font-bold text-primary-dark mb-4">Recent Activity</h3>
        <div className="py-12 border-2 border-dashed border-light-neutral/80 rounded-xl bg-soft-ivory/50 flex flex-col items-center justify-center text-center">
          <p className="text-primary-dark/60 font-medium mb-2">Detailed reporting modules coming soon.</p>
          <p className="text-sm text-primary-dark/40 max-w-sm">
            Future updates will include recent orders, inventory warnings, and performance analytics directly on this dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
