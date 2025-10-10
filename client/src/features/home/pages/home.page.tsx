import CTASection from '../components/cta.home';
import FeaturesSection from '../components/features.home';
import Footer from '../components/footer.home';
import Hero from '../components/hero.home';
import MockupSection from '../components/mockup.home';
import Navbar from '../components/navbar.home';

type Props = {};

export default function HomePage({}: Props) {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <div className="bg-gray-950">
        <MockupSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
}
