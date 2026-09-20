import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Archive, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/categories', label: 'Categories', icon: Tag },
  { path: '/admin/inventory', label: 'Inventory', icon: Archive },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      if (onCloseMobile) onCloseMobile();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-light-neutral">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-light-neutral">
        <Link to="/admin/dashboard" className="text-xl font-bold tracking-wider text-primary-dark uppercase">
          Mobitech <span className="text-primary-dark-teal">Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-dark-teal text-white'
                      : 'text-primary-dark hover:bg-light-neutral/50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-light-neutral">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
