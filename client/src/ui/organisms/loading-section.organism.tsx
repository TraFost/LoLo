import LoloIcon from '../molecules/lolo-icon.molecule';
import { motion } from 'motion/react';

export function LoadingSection() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white overflow-hidden">
      <motion.div
        className="size-40 md:size-56 mb-6"
        initial={{ y: 0, opacity: 0.8 }}
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
        <LoloIcon animation="float" />
      </motion.div>

      <motion.p
        className="text-2xl font-semibold tracking-wide text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Processing match data<span className="animate-pulse">...</span>
      </motion.p>
    </div>
  );
}
