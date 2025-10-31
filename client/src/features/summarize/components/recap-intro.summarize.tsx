import { motion } from 'motion/react';

interface Props {
  gameName: string;
  tagName: string;
  championName: string;
}

export function RecapIntro({ gameName, tagName, championName }: Props) {
  return (
    <section className="w-full h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName.replace(
            /\s+/g,
            '',
          )}_0.jpg')`,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      ></motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-transparent"></div>

      <motion.div
        className="flex flex-col gap-4 items-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.img
          src="https://ddragon.leagueoflegends.com/cdn/15.20.1/img/profileicon/685.png"
          alt="LoLo AI"
          width={128}
          height={128}
          className="drop-shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        <motion.h1
          className="text-5xl font-bold tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {gameName}#<span className="text-primary">{tagName}</span>
        </motion.h1>
      </motion.div>

      <motion.div
        className="w-2/3 max-w-3xl mt-12 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2 }}
      >
        <p className="text-xl text-slate-300 font-light leading-relaxed">
          Collaboration defines your journey this season. You fought side by side, learned from
          every battle, and discovered the power of persistence. Now it's time to reflect, and
          celebrate how far you've come.
        </p>
      </motion.div>
    </section>
  );
}
