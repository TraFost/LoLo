import { useEffect, useState } from 'react';
import LoloIcon from '../molecules/lolo-icon.molecule';
import { AnimatePresence, motion } from 'motion/react';
import { HextechDivider } from '../atoms/hextech-divider';

const loadingMessages = [
  'Calculating your KDA',
  'Analyzing your lane dominance',
  'Counting your total pentakills (or attempts)',
  'Consulting the Elder Dragon',
  'Fetching match history',
  'Debating if that was truly a "skill issue"',
  'Polishing your S+ grades',
  'Almost done, just warding the river',
];

interface LoadingSectionProps {
  isLoading?: boolean;
  showProgressBar?: boolean;
}

export function LoadingSection({ isLoading = true, showProgressBar = false }: LoadingSectionProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3500);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (showProgressBar && isLoading) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 85) {
            const increment = Math.random() * 5 + 2;
            return Math.min(prev + increment, 85);
          }
          return prev;
        });
      }, 1000);
    } else if (showProgressBar && !isLoading) {
      setProgress(100);
    } else {
      setProgress(0);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading, showProgressBar]);

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

      <p className="text-5xl font-bebas-neue tracking-wider text-yellow-400 mt-6">
        {showProgressBar ? 'FORGING YOUR RECAP' : 'GETTING YOUR ACCOUNT INFORMATION'}
      </p>
      <HextechDivider />

      <div className="h-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="text-xl font-semibold tracking-wide text-gray-300 text-center"
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

      {/* Progress Bar */}
      {showProgressBar && (
        <div className="w-80 max-w-full mt-8 px-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <motion.div
              className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-yellow-400 font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
