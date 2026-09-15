import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
      </main>
    </div>
  );
}
