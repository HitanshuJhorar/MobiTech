import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 'featured',
    title: 'Featured\nCollection',
    description: 'Premium Mobile Accessories\nfor your everyday setup.',
    image: '/images/collections/featured-placeholder.svg',
    className: 'md:col-span-2 md:row-span-2 bg-primary-dark-teal',
    titleClass: 'text-h1 mb-4 text-white',
    descClass: 'text-body-large text-white/80',
    imageClass: 'absolute -bottom-10 -right-10 w-[80%] max-w-sm object-contain',
    padClass: 'p-8 md:p-12',
    to: '/shop',
  },
  {
    id: 'magsafe',
    title: 'MagSafe\nAccessories',
    image: '/images/collections/magsafe-placeholder.svg',
    className: 'bg-secondary-teal',
    titleClass: 'text-h3 text-white',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-4 translate-y-4',
    padClass: 'p-6 md:p-8',
    to: '/shop?category=magsafe-accessories',
  },
  {
    id: 'audio',
    title: 'Wireless\nAudio',
    image: '/images/collections/wireless-audio-placeholder.svg',
    className: 'bg-muted-teal',
    titleClass: 'text-h3 text-white',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-2 translate-y-2',
    padClass: 'p-6 md:p-8',
    to: '/shop?category=audio',
  },
  {
    id: 'wireless-essentials',
    title: 'Wireless\nEssentials',
    image: '/images/collections/wireless-essentials-placeholder.svg',
    className: 'bg-primary-dark',
    titleClass: 'text-h3 text-white',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-2 translate-y-2',
    padClass: 'p-6 md:p-8',
    to: '/shop?category=wireless-essentials',
  },
  {
    id: 'gaming-essentials',
    title: 'Gaming\nEssentials',
    image: '/images/collections/gaming-essentials-placeholder.svg',
    className: 'bg-secondary-teal',
    titleClass: 'text-h3 text-white',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-2 translate-y-2',
    padClass: 'p-6 md:p-8',
    to: '/shop?category=gaming',
  },
  {
    id: 'chargers',
    title: 'Premium\nChargers',
    image: '/images/collections/premium-chargers-placeholder.svg',
    className: 'md:col-span-2 bg-primary-dark-teal',
    titleClass: 'text-h2 text-white',
    imageClass: 'absolute bottom-0 right-0 h-full w-auto object-contain translate-x-4',
    padClass: 'p-6 md:p-8',
    to: '/shop?category=charging',
  },
  {
    id: 'new-arrivals',
    title: 'New\nArrivals',
    image: '/images/collections/new-arrivals-placeholder.svg',
    className: 'bg-primary-dark',
    titleClass: 'text-h3 text-white',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-2 translate-y-2',
    padClass: 'p-6 md:p-8',
    to: '/shop?sort=newest',
  },
  {
    id: 'limited',
    title: 'Limited Edition\nProducts',
    image: '/images/collections/limited-edition-placeholder.svg',
    className: 'bg-muted-teal',
    titleClass: 'text-h3 text-white',
    imageClass: 'absolute bottom-0 right-0 w-[70%] object-contain translate-x-2 translate-y-2',
    padClass: 'p-6 md:p-8',
    to: '/shop',
  }
];

export function FeaturedCollections() {
  return (
    <section className="py-20 bg-soft-ivory">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-[250px] md:auto-rows-[300px]">
          {collections.map((item) => (
            <Link key={item.id} to={item.to} className={`block ${item.className}`}>
              <Card 
                variant="default"
                className="relative overflow-hidden group border-none flex flex-col h-full bg-transparent"
              >
                <div className={`relative z-10 flex flex-col h-full ${item.padClass}`}>
                  <h3 className={`whitespace-pre-line ${item.titleClass}`}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className={`whitespace-pre-line mt-2 ${item.descClass}`}>
                      {item.description}
                    </p>
                  )}
                  
                  {/* Arrow Button */}
                  <div className="mt-auto pt-8">
                    <span aria-label={`View ${item.title.replace('\n', ' ')}`} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors text-white">
                      <ArrowRight size={20} strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
                
                <img 
                  src={item.image} 
                  alt={`${item.title.replace('\n', ' ')} artwork`} 
                  className={`z-0 transition-transform duration-500 group-hover:scale-105 ${item.imageClass}`}
                  loading="lazy"
                />
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
