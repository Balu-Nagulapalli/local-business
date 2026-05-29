import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';
import FeaturedSection from '../components/home/FeaturedSection';
import HowItWorks from '../components/home/HowItWorks';
import CTABanner from '../components/home/CTABanner';

export default function Home() {
  return (
    <div>
      <Hero />
      <CategorySection />
      <FeaturedSection />
      <HowItWorks />
      <CTABanner />
    </div>
  );
}
