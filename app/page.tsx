import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { PartnersSection } from '@/components/sections/PartnersSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PartnersSection />
      </main>
      <Footer />
    </>
  );
}
