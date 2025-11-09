import { motion } from 'framer-motion';
import TagInput from '@/ui/molecules/tag-input.molecule';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white py-36 px-6 md:px-16 flex flex-col items-center text-center">
      {/* Background glow accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-24 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-24 right-1/3 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow delay-700" />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white"
      >
        Ready to Level Up Your Gameplay?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="text-gray-400 text-lg md:text-xl max-w-2xl mt-6 mb-12 leading-relaxed"
      >
        Let LoLo analyze your matches, decode your decisions, and uncover what makes you win.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        <TagInput />
      </motion.div>
    </section>
  );
}
