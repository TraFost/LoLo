import { motion } from 'motion/react';
import { LineChart, Brain, Trophy } from 'lucide-react';

import { Description } from '@/ui/atoms/typography/description.atom';
import { Header } from '@/ui/atoms/typography/header.atom';
import { YouTubePlayer } from '@/ui/molecules/youtube-video-player';

import { createStaggerContainer, fadeInUp, fadeIn, scaleIn } from '@/lib/utils/motion.util'; // + add these

const featuresContainer = createStaggerContainer(0.05, 0.15);

export const FEATURES = [
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Season Arc Card',
    desc: 'See your year in a single glance. LoLo turns your match history into a clear story of progress, highlighting one theme, one trend, and one takeaway.',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Post-Match Debrief',
    desc: 'Get three insights, one habit to practice, and a coach line after each game. No noise, no data dumps—just what helps you improve next round.',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Pro Playstyle Match',
    desc: 'Discover which pro player’s gameplay mirrors yours. LoLo compares your stats to top pros and reveals how your style stacks up.',
  },
];

export function Features() {
  return (
    <motion.section
      variants={featuresContainer}
      viewport={{ once: true, amount: 0.25 }}
      className="bg-gray-950 py-14"
      aria-label="LoLo Features"
      initial="hidden"
      whileInView="visible"
    >
      <div className="max-w-7xl mx-auto px-4 gap-16 justify-between md:px-8 lg:flex">
        <motion.div variants={fadeInUp}>
          <div className="max-w-xl space-y-3">
            <Header tag="h3" text="Features" />
            <Description
              tag="p"
              text="We stripped away the clutter. All that’s left is what helps you grow."
            />
          </div>

          <div className="mt-12 max-w-lg lg:max-w-none">
            <ul className="space-y-8">
              {FEATURES.map((item) => (
                <motion.li key={item.title} className="flex gap-x-4" variants={fadeIn}>
                  <div className="flex-none w-12 h-12 bg-indigo-50 text-primary rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <Header tag="h3" text={item.title} className="text-2xl!" />
                    <Description tag="p" text={item.desc} className="min-w-full text-gray-300" />
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          variants={scaleIn}
          className="mt-12 lg:mt-0 w-full lg:max-w-xl flex items-center"
        >
          <div className="w-full max-w-[720px] lg:min-w-[650px]">
            <YouTubePlayer videoId="dQw4w9WgXcQ" expandButtonClassName="text-white" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
