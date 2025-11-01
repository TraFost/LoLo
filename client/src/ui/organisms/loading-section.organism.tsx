import { useEffect, useState } from 'react';
import LoloIcon from '../molecules/lolo-icon.molecule';
import { AnimatePresence, motion } from 'motion/react';

function HextechDivider() {
  return (
    <div className="w-[200px] flex items-center justify-center my-6" aria-hidden="true">
      <div className="h-[1px] w-full bg-gradient-to-l from-yellow-600/80 via-yellow-400/30 to-transparent" />
      <div className="w-2.5 h-2.5 rotate-45 border border-yellow-600/80 mx-2" />
      <div className="h-[1px] w-full bg-gradient-to-r from-yellow-600/80 via-yellow-400/30 to-transparent" />
    </div>
  );
}

const loadingMessages = [
  'Calculating your KDA...',
  'Analyzing your lane dominance...',
  'Counting your total pentakills (or attempts)...',
  'Consulting the Elder Dragon...',
  'Fetching match history...',
  'Debating if that was truly a "skill issue"...',
  'Polishing your S+ grades...',
  'Almost done, just warding the river...',
];

export function LoadingSection() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white overflow-hidden">
      <motion.div
        className="size-40 md:size-56"
        animate={{
          y: [0, -15, 0],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <LoloIcon />
      </motion.div>

      <p className="text-5xl font-[Bebas_Neue] tracking-wider text-yellow-400 mt-6">
        FORGING YOUR RECAP
      </p>
      <HextechDivider />

      <div className="h-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="text-xl font-semibold tracking-wide text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {loadingMessages[messageIndex]}
            <span className="animate-pulse">...</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
