import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Quote } from 'lucide-react';

const stories = [
  {
    id: 's1',
    name: 'Aarav Mehta',
    initials: 'AM',
    role: 'Customer Review',
    text: "Beautiful case, excellent finish and it feels much more premium than I expected. The attention to detail is noticeable right out of the box.",
    className: 'md:col-span-2 lg:col-span-2 lg:row-span-2 bg-primary-dark-teal text-white',
    textClass: 'text-h2 md:text-h1 lg:text-4xl text-white leading-tight font-medium',
    avatarClass: 'bg-white/10 text-white',
    roleClass: 'text-white/70',
    quoteClass: 'text-white/10',
  },
  {
    id: 's2',
    name: 'Riya Sharma',
    initials: 'RS',
    role: 'Customer Review',
    text: "The earbuds sound great and the entire buying experience felt simple and smooth.",
    className: 'bg-white text-primary-dark border border-light-neutral/50',
    textClass: 'text-body-large text-primary-dark-teal',
    avatarClass: 'bg-soft-ivory text-primary-dark',
    roleClass: 'text-primary-dark-teal/60',
    quoteClass: 'text-primary-dark/5',
  },
  {
    id: 's3',
    name: 'Kunal Verma',
    initials: 'KV',
    role: 'Customer Review',
    text: "Finally found accessories that actually look as good as they work. Highly recommended.",
    className: 'bg-warm-cream/50 text-primary-dark border border-light-neutral/30',
    textClass: 'text-body-large text-primary-dark-teal',
    avatarClass: 'bg-white text-primary-dark',
    roleClass: 'text-primary-dark-teal/60',
    quoteClass: 'text-primary-dark/5',
  },
  {
    id: 's4',
    name: 'Ananya Kapoor',
    initials: 'AK',
    role: 'Customer Review',
    text: "Fast delivery, clean packaging and the charger has become part of my everyday setup.",
    className: 'bg-white text-primary-dark border border-light-neutral/50',
    textClass: 'text-body-large text-primary-dark-teal',
    avatarClass: 'bg-soft-ivory text-primary-dark',
    roleClass: 'text-primary-dark-teal/60',
    quoteClass: 'text-primary-dark/5',
  },
  {
    id: 's5',
    name: 'Rahul Saini',
    initials: 'RS',
    role: 'Customer Review',
    text: "Minimal design, solid quality and exactly what I wanted for my phone. It's perfect.",
    className: 'bg-muted-teal text-white',
    textClass: 'text-body-large text-white',
    avatarClass: 'bg-white/10 text-white',
    roleClass: 'text-white/70',
    quoteClass: 'text-white/10',
  },
];

export function CustomerStories() {
  return (
    <section className="py-24 bg-soft-ivory">
      <Container>
        <SectionHeading 
          title="Customer Stories" 
          subtitle="Real experiences from our community."
          className="mb-12"
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-[auto]">
          {stories.map((story, index) => (
            <Card 
              key={story.id} 
              variant="default"
              className={`relative overflow-hidden group border-none p-6 md:p-8 flex flex-col justify-between h-full transition-transform duration-300 hover:-translate-y-1 ${story.className}`}
              style={{ borderRadius: '1.5rem' }}
            >
              {/* Background Quote Icon */}
              <div className={`absolute top-6 right-6 z-0 ${story.quoteClass}`}>
                <Quote size={index === 0 ? 120 : 60} strokeWidth={1} className="opacity-50 rotate-180" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex-grow mb-8 md:mb-12">
                <p className={story.textClass}>
                  "{story.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="relative z-10 flex items-center gap-4 mt-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${story.avatarClass}`}>
                  {story.initials}
                </div>
                <div>
                  <div className="font-bold">{story.name}</div>
                  <div className={`text-sm ${story.roleClass}`}>{story.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
