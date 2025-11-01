import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoloIcon from '@/ui/molecules/lolo-icon.molecule';

const playerAnalysis = [
  { label: 'Preferred Role', value: 'Mid Lane' },
  { label: 'Playstyle', value: 'Calculated & Reactive' },
  { label: 'Team Impact', value: 'Consistent Lead Builder' },
  { label: 'Decision Tempo', value: 'Measured, rarely rushed' },
];

const proPlayer = {
  name: 'Faker',
  role: 'Mid Lane',
  playstyle: 'Controlled Aggression',
  similarities: ['lane dominance', 'map awareness', 'tempo control'],
  playstyleDetails: [
    'You maintain lane pressure with composure and rarely overcommit. You rely on consistent trades, wave control, and vision timing rather than raw aggression.',
    'When opportunities arise, you act decisively but only when your setup ensures advantage. You play like a strategist, not a gambler.',
  ],
  summary:
    'Your play embodies controlled precision much like Faker, you manage risk with intelligence and let fundamentals carry your advantage. Both of you turn small wins into complete dominance.',
};

export function ProPlayer() {
  const [status, setStatus] = useState<'locked' | 'loading' | 'revealed'>('locked');

  useEffect(() => {
    setTimeout(() => setStatus('loading'), 500);
    setTimeout(() => setStatus('revealed'), 1000);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden mt-24 grid grid-cols-1 lg:grid-cols-2">
      {/* Divider (desktop only) */}
      <div className="absolute hidden lg:block top-0 left-1/2 w-[3px] h-full bg-gradient-to-b from-blue-400 to-transparent origin-top-left transform -skew-x-6" />

      {/* LEFT - Player Stats */}
      <motion.div
        initial={{ x: -500 }}
        whileInView={{ x: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.3,
          ease: 'linear', // gerak lurus tanpa halus
        }}
        className="flex flex-col justify-center items-center p-6 lg:pr-12"
      >
        <div className="max-w-md text-center lg:text-left">
          <h3 className="text-3xl lg:text-5xl font-bold text-white">LoLo#AI</h3>
          <p className="text-gray-300 text-base lg:text-lg mt-4 leading-relaxed mb-6">
            From your plays to your instincts, this is the essence of how you approach the game.
          </p>

          <div className="grid grid-cols-2 gap-4 text-gray-300">
            {playerAnalysis.map((stat, i) => (
              <div key={i}>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT - Comparison / Loading / Reveal */}
      <div className="relative flex flex-col items-center justify-start lg:justify-center p-6 lg:pl-12 text-center lg:text-left">
        <AnimatePresence mode="wait">
          {status === 'locked' && (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6 max-w-md mx-auto"
            >
              <p className="text-lg lg:text-xl text-gray-400">
                I think I've seen a playstyle like yours before... wanna see who it is?
              </p>
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 text-blue-400 items-center"
            >
              <div className="w-24">
                <LoloIcon size="sm" animation="spin" />
              </div>
              <p className="text-lg lg:text-xl">Analyzing your gameplay...</p>
            </motion.div>
          )}

          {status === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                ease: 'linear', // langsung, tanpa kurva halus
              }}
              className="relative w-full max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Player Descriptive Summary */}
                <div className="flex flex-col gap-3 text-gray-300 order-2 md:order-1">
                  <h4 className="text-2xl font-bold text-white mb-2">Your Playstyle</h4>
                  {proPlayer.playstyleDetails.map((detail, i) => (
                    <p key={i} className="text-gray-300">
                      {detail}
                    </p>
                  ))}
                </div>

                {/* Pro Player Comparison */}
                <div className="flex flex-col items-center md:items-start gap-3 order-1 md:order-2">
                  <img
                    src="https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2020/12/16/c61kpj1fxidgnwiqgz2h/faker-t1-lol"
                    alt="faker"
                    className="aspect-square object-cover w-40 h-40 md:w-52 md:h-52"
                  />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{proPlayer.name}</h2>
                  <p className="text-gray-400 text-base md:text-lg">
                    {proPlayer.role}, {proPlayer.playstyle}
                  </p>
                  <div className="mt-2 text-gray-300">
                    <p className="text-sm">
                      Similarities found in: {proPlayer.similarities.join(', ')}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison Summary */}
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, ease: 'linear' }}
                className="mt-10 border-t border-gray-700 pt-6"
              >
                <h3 className="text-3xl font-bold text-white">Match Insight</h3>
                <p className="text-gray-300 mt-2 leading-relaxed">{proPlayer.summary}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {status === 'revealed' && (
          <motion.div
            className="absolute inset-0 bg-blue-500/10 blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        )}
      </div>
    </section>
  );
}
