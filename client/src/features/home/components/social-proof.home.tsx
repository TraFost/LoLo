import { motion } from 'motion/react';

const proofPoints = [
  'Powered by AWS Bedrock LLMs',
  'Riot Games API compliant and secure',
  'Respectful of your data privacy',
];

const marqueeItems = [...proofPoints, ...proofPoints];

export function SocialProofBar() {
  return (
    <section className="relative overflow-hidden border-y bg-black">
      <div className="absolute inset-0" />
      <motion.div
        className="flex min-w-full items-center whitespace-nowrap py-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {marqueeItems.map((text, idx) => (
          <motion.span
            key={`${text}-${idx}`}
            className="mx-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-gray-300 sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
          >
            {text}
          </motion.span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black via-black/70 to-transparent" />
    </section>
  );
}
