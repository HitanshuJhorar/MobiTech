import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center pt-32 pb-16 overflow-hidden bg-gradient-premium">
      {/* Decorative Atmospheric Glow */}
      <div className="absolute top-0 right-0 w-[80%] h-[100%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary-teal/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Background Decorative Text */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center overflow-hidden z-0 select-none opacity-[0.03]">
        <span className="text-[18vw] font-bold leading-none tracking-tighter text-primary-dark -ml-[2%]">PREMIUM</span>
        <span className="text-[18vw] font-bold leading-none tracking-tighter text-primary-dark ml-[5%]">ACCESSORIES</span>
      </div>

      <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Content */}
        <div className="max-w-xl z-10">
          <h1 className="text-display mb-6">
            Accessories That<br />
            Feel Premium
          </h1>
          <p className="text-body-large mb-10 max-w-[28rem]">
            Premium Mobile Accessories for your<br />
            everyday setup.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/shop">
              <Button variant="primary" size="lg">Shop Collection</Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" size="lg" className="border-primary-dark-teal/30 hover:bg-white/20">Explore Categories</Button>
            </Link>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[1/1] flex items-center justify-center z-10">
           <img 
             src="/images/hero-products-placeholder.svg" 
             alt="Premium Mobile Accessories Collection"
             className="w-full h-full object-contain"
           />
        </div>
      </Container>
    </section>
  );
}
