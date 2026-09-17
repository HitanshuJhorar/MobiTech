import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Simple title mapping based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/products')) return 'Products';
    if (path.includes('/categories')) return 'Categories';
    if (path.includes('/inventory')) return 'Inventory';
    if (path.includes('/orders')) return 'Orders';
    return 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-soft-ivory flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 z-30">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <AdminSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader 
          title={getPageTitle()} 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)} 
        />
        <div className="flex-1 p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
