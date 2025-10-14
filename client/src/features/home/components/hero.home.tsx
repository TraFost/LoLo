import { motion, useReducedMotion } from 'motion/react';
import { createStaggerContainer, fadeIn, fadeInUp, scaleIn } from '@/lib/utils/motion.utils';
import { Button } from '@/ui/atoms/button.atom';

const heroContainer = createStaggerContainer(0.15, 0.12);

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      role="region"
      aria-label="LoLo hero"
      initial="hidden"
      animate="visible"
      variants={heroContainer}
      className="relative overflow-hidden px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-black via-[#0f1028] to-[#05060f] text-white"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 py-20 sm:py-24 md:grid-cols-2 lg:gap-14">
        <motion.div
          variants={fadeInUp}
          className="order-2 md:order-1 flex w-full max-w-xl flex-col gap-6"
        >
          <motion.h1
            variants={fadeIn}
            className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-primary drop-shadow-[0_8px_40px_rgba(83,90,255,0.45)] [text-wrap:balance]"
          >
            Start Learning. Start Winning.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg leading-relaxed text-gray-300 [text-wrap:balance]"
          >
            Smarter feedback, less noise. LoLo shows what matters so you can play better next game.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-2 flex flex-col gap-4 sm:flex-row">
            <motion.div
              whileHover={!reduce ? { y: -4, scale: 1.02 } : undefined}
              whileTap={!reduce ? { scale: 0.98 } : undefined}
            >
              <Button
                variant="offset"
                color="primary"
                size="lg"
                className="w-full sm:w-auto"
                aria-label="Analyze my matches"
              >
                Analyze My Matches
              </Button>
            </motion.div>
            <motion.div
              whileHover={!reduce ? { y: -4, scale: 1.02 } : undefined}
              whileTap={!reduce ? { scale: 0.98 } : undefined}
            >
              <Button
                variant="offset"
                color="accent"
                size="lg"
                className="w-full sm:w-auto"
                aria-label="See how LoLo works"
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div variants={scaleIn} className="order-1 md:order-2 relative">
          <div className="relative mx-auto w-full max-w-[36rem]">
            <div className="relative aspect-[4/3]">
              <motion.div
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(83,90,255,0.45)_0%,rgba(22,24,56,0.6)_55%,transparent_85%)] blur-[120px]"
                animate={
                  !reduce ? { opacity: [0.55, 0.85, 0.55], scale: [0.95, 1.05, 0.95] } : undefined
                }
                transition={
                  !reduce ? { duration: 6.4, repeat: Infinity, ease: 'easeInOut' } : undefined
                }
              />
              <motion.img
                src="/assets/icon/lolo-main.webp"
                alt="LoLo icon"
                className="absolute inset-0 m-auto h-full w-auto max-w-full object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                animate={!reduce ? { rotate: [0, 2, -2, 0] } : undefined}
                transition={
                  !reduce ? { duration: 8, repeat: Infinity, ease: 'easeInOut' } : undefined
                }
              />
              <motion.div
                aria-hidden
                className="absolute -inset-8 -z-20 rounded-[28%] border border-primary/40"
                animate={!reduce ? { rotate: 360 } : undefined}
                transition={
                  !reduce ? { duration: 26, repeat: Infinity, ease: 'linear' } : undefined
                }
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(83,90,255,0.18),transparent_60%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,transparent_40%,rgba(83,90,255,0.08)_70%,transparent_100%)]"
        animate={!reduce ? { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] } : undefined}
        transition={!reduce ? { duration: 18, repeat: Infinity, ease: 'linear' } : undefined}
      />
    </motion.section>
  );
}
