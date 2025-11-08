import { motion, AnimatePresence } from 'motion/react';

import LoloIcon from '@/ui/molecules/lolo-icon.molecule';
import ChartRadar from '@/ui/molecules/chart-radar.molecule';

import { PLAYER_IMAGES } from '@/core/constants/player.constant';
import { useQuery } from '@tanstack/react-query';
import { AnalyzeResponse } from '@/types/analyze';

interface Props {
  playerName: string;
  puuid: string;
  region: string;
}

export function ProPlayer({ playerName, puuid, region }: Props) {
  const { data, error, isError, isPending } = useQuery<AnalyzeResponse>({
    queryKey: ['analyze', puuid, region],
    queryFn: () => Promise.reject('disabled'),
    enabled: false,
  });

  const { comparison } = data ?? {};

  return (
    <section className="relative min-h-screen w-full overflow-hidden mt-24 grid grid-cols-1 lg:grid-cols-2">
      {/* Divider (desktop only) */}
      <div className="absolute hidden lg:block top-0 left-1/2 w-[3px] h-full bg-gradient-to-b from-blue-400 to-transparent origin-top-left transform -skew-x-6" />

      {/* LEFT - Player Stats */}
      <motion.div
        initial={{ x: -500 }}
        whileInView={{ x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: 'linear' }}
        className="flex flex-col justify-center items-center p-6 lg:pr-12"
      >
        {isPending && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center gap-8 py-20 text-gray-300"
          >
            {/* Icon + Subtle Glow */}
            <motion.div
              className="relative w-24 h-24"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            >
              <div className="absolute inset-0 bg-cyan-400/10 blur-2xl rounded-full" />
              <LoloIcon size="sm" animation="spin" />
            </motion.div>

            {/* Text Section */}
            <div className="max-w-lg space-y-3">
              <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Analyzing {playerName}
              </h3>
              <p className="text-base lg:text-lg leading-relaxed text-gray-400">
                Gathering your match history, decoding your plays, and refining your performance
                metrics.
                <br />
                Sit tight while LoLo crafts your personalized analysis.
              </p>
            </div>

            {/* Subtle Pulse Bar */}
            <motion.div
              className="w-48 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-400 to-purple-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            />

            {/* Small Footer Text */}
            <p className="text-sm text-gray-500 italic mt-2">This might take a few seconds...</p>
          </motion.div>
        )}

        {isError && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 text-blue-400 items-center"
          >
            <p className="text-red-400 font-semibold text-lg">Something went wrong</p>
            <p className="text-slate-400 text-sm max-w-md">{error.message}</p>
          </motion.div>
        )}

        {comparison && (
          <>
            <div className="max-w-md text-center lg:text-left">
              <h3 className="text-3xl lg:text-5xl font-bold text-white">{playerName}</h3>
              <p className="text-gray-300 text-base lg:text-lg mt-4 leading-relaxed mb-6">
                From your plays to your instincts, this is the essence of how you approach the game.
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-300">
                {comparison.playerAnalysis.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    className="border-l border-blue-800 pl-4 hover:border-blue-500 transition-colors duration-200"
                  >
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-lg font-semibold text-white mt-1">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: 'linear',
                delay: 0.5,
              }}
              className="w-full"
            >
              <ChartRadar
                data={comparison.comparisonChart}
                playerName={playerName}
                proPlayerName={comparison.proPlayer.name}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* RIGHT - Comparison / Loading / Reveal */}
      <div className="relative flex flex-col items-center justify-start lg:justify-center p-6 lg:pl-12 text-center lg:text-left">
        {isPending && (
          <motion.div
            key="pro-player-loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5 text-center text-blue-400 py-16"
          >
            {/* Animated Icon */}
            <motion.div
              className="relative w-24 h-24"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
              <LoloIcon size="sm" animation="spin" />
            </motion.div>

            {/* Text Section */}
            <div className="space-y-2">
              <h3 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
                Analyzing pro player matchups
              </h3>
              <p className="text-sm lg:text-base text-gray-400 max-w-md mx-auto leading-relaxed">
                Comparing your gameplay with top-tier pros, and finding whose style fits you best
              </p>
            </div>

            {/* Progress Pulse Bar */}
            <motion.div
              className="w-40 h-1 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            />

            {/* Subtle Hint */}
            <p className="text-xs text-gray-500 italic mt-3">This may take a few moments...</p>
          </motion.div>
        )}

        {isError && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 text-blue-400 items-center"
          >
            <p className="text-red-400 font-semibold text-lg">Something went wrong</p>
            <p className="text-slate-400 text-sm max-w-md">{error.message}</p>
          </motion.div>
        )}

        {comparison && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key="revealed"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.3,
                  ease: 'linear',
                }}
                className="relative w-full max-w-2xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Player Descriptive Summary */}
                  <div className="flex flex-col gap-3 text-gray-300 order-2 md:order-1">
                    <h4 className="text-2xl font-bold text-white mb-2">Your Playstyle</h4>
                    {comparison.proPlayer.playstyleDetails.map((detail, i) => (
                      <p key={i} className="text-gray-300">
                        {detail}
                      </p>
                    ))}
                  </div>

                  {/* Pro Player Comparison */}
                  <div className="flex flex-col items-center md:items-start gap-3 order-1 md:order-2">
                    <img
                      src={PLAYER_IMAGES[comparison.proPlayer.name.toLowerCase()]}
                      alt={comparison.proPlayer.name}
                      className="aspect-square object-cover w-40 h-40 md:w-52 md:h-52"
                    />
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {comparison.proPlayer.name}
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg">
                      {comparison.proPlayer.role}, {comparison.proPlayer.playstyle}
                    </p>
                    <div className="mt-2 text-gray-300">
                      <p className="text-sm">
                        Similarities found in: {comparison.proPlayer.similarities.join(', ')}.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comparison Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, ease: 'linear' }}
                  className="mt-10 border-t border-gray-700 pt-6"
                >
                  <h3 className="text-3xl font-bold text-white">Match Insight</h3>
                  <p className="text-gray-300 mt-2 leading-relaxed">
                    {comparison.proPlayer.summary}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 blur-3xl size-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </>
        )}
      </div>
    </section>
  );
}
