import { motion } from 'motion/react';
import { createStaggerContainer, fadeIn, fadeInUp } from '@/lib/utils/motion.util';

const FAQS = [
  {
    question: 'Is my Riot account data safe?',
    answer:
      'Yes. LoLo only uses Riot’s official API, so your data stays private and never leaves your control. We cache a minimal subset to generate reflections and purge it on request.',
  },
  {
    question: 'Do I need to play ranked to use LoLo?',
    answer:
      'Yes. LoLo currently ingests only Ranked Solo/Duo games so we can keep comparisons consistent and trend lines meaningful.',
  },
  {
    question: 'What makes LoLo different from other stat trackers?',
    answer:
      'Instead of flooding you with numbers, LoLo gives short, coach-style insights that focus on habits, decisions, and progress over time.',
  },
  {
    question: 'Does LoLo support every role?',
    answer:
      'Yes. LoLo tracks lane behavior, early objectives, and macro trends across all five roles.',
  },
  {
    question: 'Can I see which pro player I play like?',
    answer:
      'Yes. LoLo compares your stats to professional players and shows whose playstyle most closely matches yours.',
  },
];

const faqContainer = createStaggerContainer(0.1, 0.18);

export function FAQ() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={faqContainer}
      className="relative overflow-hidden bg-black px-6 py-24 text-white sm:px-10"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-16 md:flex-row md:gap-20">
        <motion.div variants={fadeInUp} className="flex-1 max-w-md">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-gray-400 sm:text-lg">
            Everything you might wonder about LoLo
          </p>
        </motion.div>

        <motion.div variants={faqContainer} className="flex-1 space-y-6 divide-y divide-white/20">
          {FAQS.map((item) => (
            <motion.div key={item.question} variants={fadeIn} className="pt-6 first:pt-0 mb-0">
              <h3 className="text-lg font-semibold text-primary">{item.question}</h3>
              <p className="my-2 text-sm leading-relaxed text-gray-300 sm:text-base">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(83,90,255,0.14),transparent_70%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3, ease: 'easeOut' }}
      />
    </motion.section>
  );
}
