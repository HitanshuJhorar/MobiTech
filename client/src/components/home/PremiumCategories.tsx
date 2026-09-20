import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'cases',
    name: 'Phone Cases',
    to: '/shop?category=phone-cases',
    image: '/images/categories/phone-cases-placeholder.svg',
    className: 'md:col-span-2 bg-primary-dark-teal text-white',
    titleClass: 'text-white',
    imageClass: 'absolute bottom-0 right-0 w-[50%] md:w-[40%] object-contain translate-x-4 translate-y-4',
    buttonClass: 'bg-white/10 hover:bg-white/20 text-white',
  },
  {
    id: 'audio',
    name: 'Audio',
    to: '/shop?category=audio',
    image: '/images/categories/audio-placeholder.svg',
    className: 'md:row-span-2 bg-warm-cream text-primary-dark',
    titleClass: 'text-primary-dark',
    imageClass: 'absolute bottom-0 right-0 w-[80%] object-contain translate-x-2 translate-y-2',
    buttonClass: 'bg-primary-dark/5 hover:bg-primary-dark/10 text-primary-dark',
  },
  {
    id: 'charging',
    name: 'Charging',
    to: '/shop?category=charging',
    image: '/images/categories/charging-placeholder.svg',
    className: 'bg-muted-teal text-white',
    titleClass: 'text-white',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-2 translate-y-2',
    buttonClass: 'bg-white/10 hover:bg-white/20 text-white',
  },
  {
    id: 'power',
    name: 'Power',
    to: '/shop?category=power',
    image: '/images/categories/power-placeholder.svg',
    className: 'bg-white text-primary-dark border border-light-neutral/50',
    titleClass: 'text-primary-dark',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-2 translate-y-2 mix-blend-multiply',
    buttonClass: 'bg-primary-dark/5 hover:bg-primary-dark/10 text-primary-dark',
  },
  {
    id: 'smart',
    name: 'Smart Accessories',
    to: '/shop?category=smart-accessories',
    image: '/images/categories/smart-accessories-placeholder.svg',
    className: 'bg-secondary-teal text-white',
    titleClass: 'text-white',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-2 translate-y-2',
    buttonClass: 'bg-white/10 hover:bg-white/20 text-white',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    to: '/shop?category=gaming',
    image: '/images/categories/gaming-placeholder.svg',
    className: 'md:col-span-2 bg-primary-dark text-white',
    titleClass: 'text-white',
    imageClass: 'absolute bottom-0 right-0 w-[50%] md:w-[40%] object-contain translate-x-4 translate-y-4',
    buttonClass: 'bg-white/10 hover:bg-white/20 text-white',
  }
];

export function PremiumCategories() {
  return (
    <section className="py-20 bg-soft-ivory">
      <Container>
        <SectionHeading title="Premium Categories" className="mb-10" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[250px] md:auto-rows-[280px]">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.to}
              className={`block rounded-3xl relative overflow-hidden group border-none flex flex-col ${cat.className}`}
            >
              <div className="relative z-10 p-6 md:p-8 flex flex-col h-full pointer-events-none">
                <div className="flex justify-between items-start">
                  <h3 className={`text-h3 font-bold ${cat.titleClass}`}>
                    {cat.name}
                  </h3>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1 ${cat.buttonClass}`}>
                    <ArrowUpRight size={20} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              
              <img 
                src={cat.image} 
                alt={`${cat.name} category`} 
                className={`z-0 transition-transform duration-500 group-hover:scale-105 ${cat.imageClass}`}
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
