import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { TrendingProducts } from '../components/home/TrendingProducts';
import { PremiumCategories } from '../components/home/PremiumCategories';
import { BestSellers } from '../components/home/BestSellers';
import { CustomerStories } from '../components/home/CustomerStories';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-soft-ivory">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedCollections />
        <FeaturedProducts />
        <TrendingProducts />
        <PremiumCategories />
        <BestSellers />
        <CustomerStories />
      </main>
    </div>
  );
}
