import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { MessageCircle, Mail, ArrowUpRight } from 'lucide-react';

const shopLinks = [
  { label: 'All Products', href: '/shop' },
  { label: 'Phone Cases', href: '/shop?category=phone-cases' },
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
  const rawWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER;
  const whatsappNumber = rawWhatsApp && rawWhatsApp !== 'REPLACE_WITH_BUSINESS_NUMBER' 
    ? rawWhatsApp.replace(/[^0-9]/g, '') 
    : '';

  return (
    <footer className="relative bg-gradient-to-b from-primary-dark-teal via-primary-dark to-[#0f3536] text-white pt-24 pb-10 overflow-hidden">
      {/* Atmospheric Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary-teal/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-sand/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10 mb-20">
          
          {/* Brand & CTA Area */}
          <div className="lg:col-span-2 pr-0 lg:pr-12 flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">
              Mobitech
            </h2>
            <p className="text-white/70 mb-10 max-w-sm text-body-large leading-relaxed">
              Premium mobile accessories designed to seamlessly integrate into your everyday setup.
            </p>
            
            <div className="mt-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/10 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <span className="block text-accent-sand text-[11px] tracking-widest font-bold mb-3 uppercase">
                  NEED HELP CHOOSING?
                </span>
                <p className="text-white/80 mb-6 text-sm leading-relaxed">
                  Get personalized product recommendations directly from our team.
                </p>
                {whatsappNumber ? (
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="block w-full">
                    <button className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary-dark-teal via-primary-dark to-[#0f3536] transition-all duration-200 shadow-lg border border-white/10 hover:shadow-secondary-teal/20 hover:-translate-y-[2px] hover:border-white/20 flex items-center justify-center gap-2">
                      <MessageCircle size={16} />
                      Talk on WhatsApp
                    </button>
                  </a>
                ) : (
                  <button disabled className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white/50 bg-white/5 border border-white/5 cursor-not-allowed flex items-center justify-center gap-2">
                    <MessageCircle size={16} />
                    Talk on WhatsApp
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white text-xs font-bold mb-8 tracking-widest uppercase">SHOP</h3>
            <ul className="flex flex-col gap-4">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-white/60 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center group w-fit text-sm font-medium"
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
            <h3 className="text-white text-xs font-bold mb-8 tracking-widest uppercase">HELP</h3>
            <ul className="flex flex-col gap-4">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <span 
                    className="text-white/60 transition-all duration-200 w-fit text-sm font-medium cursor-default"
                  >
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-1">
            <h3 className="text-white text-xs font-bold mb-8 tracking-widest uppercase">CONNECT</h3>
            <ul className="flex flex-col gap-5">
              <li>
                {whatsappNumber ? (
                  <a 
                    href={`https://wa.me/${whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center gap-3 w-fit text-sm font-medium group"
                    aria-label="WhatsApp"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
                      <MessageCircle size={15} />
                    </div>
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <span className="text-white/60 opacity-50 flex items-center gap-3 w-fit text-sm font-medium cursor-not-allowed">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <MessageCircle size={15} />
                    </div>
                    <span>WhatsApp</span>
                  </span>
                )}
              </li>
              <li>
                <span className="text-white/60 flex items-center gap-3 w-fit text-sm font-medium cursor-default">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <span>Instagram</span>
                </span>
              </li>
              <li>
                <a 
                  href="mailto:support@mobitech.example.com"
                  className="text-white/60 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center gap-3 w-fit text-sm font-medium group"
                  aria-label="Email"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
                    <Mail size={15} />
                  </div>
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-white/40">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 Mobitech.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="hover:text-white transition-colors duration-200 cursor-default">
              Privacy Policy
            </span>
            <span className="hover:text-white transition-colors duration-200 cursor-default">
              Terms of Service
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
