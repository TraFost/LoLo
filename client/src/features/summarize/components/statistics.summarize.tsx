import { motion } from 'motion/react';
import { HorizontalScroll } from './horizontal-scroll.summarize';

export function Statistics() {
  return (
    <div className="w-full">
      <motion.h2
        className="text-5xl lg:text-7xl font-bold my-24 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: false, amount: 0.5 }}
      >
        First things first, let's look at the numbers!
      </motion.h2>
      <HorizontalScroll />
    </div>
  );
}
