import { CTASection } from '../components/cta.home';
import { FAQ } from '../components/faq.home';
import { Features } from '../components/features.home';
import { Footer } from '../components/footer.home';
import { Hero } from '../components/hero.home';
import { SocialProofBar } from '../components/social-proof.home';

import { MainNavbar } from '@/ui/organisms/navbar.organism';

export function HomePage() {
  return (
    <>
      <MainNavbar />
      <Hero />
      <SocialProofBar />
      <Features />
      <FAQ />
      <CTASection />
      <Footer />
    </>
  );
}
