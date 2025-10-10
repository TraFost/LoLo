import { Button } from '@/ui/atoms/button.atom';

export default function CTASection() {
  return (
    <section className="text-white py-32 px-8 md:px-24 relative overflow-hidden flex flex-col items-center text-center">
      <h2 className="text-5xl md:text-6xl font-extrabold tracking-widest text-primary mb-6">
        Ready to Level Up Your Gameplay?
      </h2>
      <p className="text-gray-400 text-lg max-w-2xl mb-12">
        Let LoLo analyze your matches and provide actionable AI insights. See your improvement
        instantly!
      </p>

      <Button variant="flat" color="primary" size="lg">
        Get Started
      </Button>

      <div className="absolute top-0 left-0 w-48 h-48 bg-primary/20 rounded-sm blur-3xl animate-pulse-slow -z-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/30 rounded-sm blur-3xl animate-pulse-slow -z-10"></div>
    </section>
  );
}
