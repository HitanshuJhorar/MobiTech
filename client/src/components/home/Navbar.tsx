import { Search, Heart, ShoppingBag, Menu } from 'lucide-react';
import { GlassSurface } from '../ui/GlassSurface';
import { IconButton } from '../ui/IconButton';

export function Navbar() {
  return (
    <div className="absolute top-0 inset-x-0 z-50 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <GlassSurface className="flex items-center justify-between px-6 py-3.5 rounded-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl tracking-tighter text-primary-dark">Mobitech</span>
        </div>
        
        {/* Search - Desktop */}
        <div className="hidden md:flex items-center bg-black/5 rounded-full px-4 py-2 flex-1 max-w-xs mx-8 border border-transparent focus-within:border-primary-dark-teal/20 focus-within:bg-white/50 transition-colors">
          <Search size={18} className="text-primary-dark-teal/50 mr-2" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-primary-dark-teal/50 text-primary-dark-teal"
            aria-label="Search"
          />
        </div>

        {/* Links - Desktop */}
        <nav className="hidden md:flex items-center gap-8 mr-8">
          {['Cases', 'Audio', 'Power', 'More'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-primary-dark hover:text-primary-dark-teal/70 transition-colors">
              {link}
            </a>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <IconButton icon={Heart} size="sm" aria-label="Wishlist" className="hidden sm:flex" />
          <IconButton icon={ShoppingBag} size="sm" aria-label="Cart" />
          <IconButton icon={Menu} size="sm" aria-label="Menu" className="md:hidden ml-2" />
        </div>
      </GlassSurface>
    </div>
  );
}
