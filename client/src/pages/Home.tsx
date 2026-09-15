import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { FeaturedProducts } from '../components/home/FeaturedProducts';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-soft-ivory">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedCollections />
        <FeaturedProducts />
      </main>
    </div>
  );
}
