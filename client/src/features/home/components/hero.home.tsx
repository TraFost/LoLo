import { Button } from '@/ui/atoms/button.atom';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-4 sm:px-6 lg:px-8 py-28 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 overflow-hidden">
      <div className="flex flex-col gap-6 max-w-xl mx-auto md:mx-0 w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-primary drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]">
          Analyze Your League Performance with AI Precision
        </h1>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          LoLo helps you uncover your strengths, fix your weaknesses, and climb faster. Get match
          insights powered by advanced AI trained on thousands of real games.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Button variant="offset" color="primary" size="lg" className="w-full sm:w-auto">
            Analyze My Match
          </Button>
          <Button variant="offset" color="accent" size="lg" className="w-full sm:w-auto">
            Learn More
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-8 md:mt-0">
        <div className="relative">
          <img
            src="/assets/icon/lolo-main.webp"
            alt="LoLo Icon"
            className="w-56 sm:w-64 md:w-72 lg:w-96 drop-shadow-[0_0_40px_rgba(59,130,246,0.4)] max-w-full"
          />
          <div className="absolute inset-0 blur-3xl bg-primary/30 -z-10"></div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_70%)]"></div>
    </section>
  );
}
