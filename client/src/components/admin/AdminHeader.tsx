import { Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminHeaderProps {
  title: string;
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ title, onOpenMobileMenu }: AdminHeaderProps) {
  const { admin } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-light-neutral px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden text-primary-dark p-1 -ml-1 rounded-md hover:bg-light-neutral/50"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-primary-dark">{title}</h1>
      </div>
      
      <div className="flex items-center">
        {admin && (
          <div className="text-sm">
            <span className="hidden sm:inline text-primary-dark/60 mr-2">Logged in as</span>
            <span className="font-medium text-primary-dark">{admin.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
