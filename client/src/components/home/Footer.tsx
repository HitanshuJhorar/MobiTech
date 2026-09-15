import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';

const shopLinks = [
  { label: 'All Products', href: '/shop' },
  { label: 'Phone Cases', href: '/shop?category=cases' },
  { label: 'Audio', href: '/shop?category=audio' },
  { label: 'Charging', href: '/shop?category=charging' },
  { label: 'Power', href: '/shop?category=power' },
  { label: 'Gaming', href: '/shop?category=gaming' },
];

const helpLinks = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'FAQs', href: '/faqs' },
];

export function Footer() {
  return (
    <footer className="bg-primary-dark-teal text-white pt-20 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & CTA Area */}
          <div className="lg:col-span-2 pr-0 lg:pr-12 flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">
              Mobitech
            </h2>
            <p className="text-white/70 mb-8 max-w-sm text-body-large">
              Premium mobile accessories for your everyday setup.
            </p>
            
            <div className="mt-auto bg-white/5 rounded-2xl p-6 border border-white/10">
              <span className="block text-accent-sand text-sm tracking-widest font-bold mb-2">
                NEED HELP CHOOSING?
              </span>
              <p className="text-white/80 mb-4 text-sm">
                Get personalized recommendations from our team.
              </p>
              <a href="https://wa.me/REPLACE_WITH_NUMBER" target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 w-full flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  Talk on WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-6 tracking-wide">SHOP</h3>
            <ul className="flex flex-col gap-4">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-white/60 hover:text-white transition-colors duration-200 flex items-center group w-fit"
                  >
                    {link.label}
                    <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-6 tracking-wide">HELP</h3>
            <ul className="flex flex-col gap-4">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-white/60 hover:text-white transition-colors duration-200 w-fit"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-6 tracking-wide">CONNECT</h3>
            <ul className="flex flex-col gap-5">
              <li>
                <a 
                  href="https://wa.me/REPLACE_WITH_NUMBER" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-3 w-fit"
                  aria-label="WhatsApp"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <MessageCircle size={16} />
                  </div>
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/REPLACE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-3 w-fit"
                  aria-label="Instagram"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@mobitech.example.com"
                  className="text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-3 w-fit"
                  aria-label="Email"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Mail size={16} />
                  </div>
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 Mobitech.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
