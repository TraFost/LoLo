import { motion } from 'motion/react';
import { LineChart, Brain, Trophy } from 'lucide-react';

import { Description } from '@/ui/atoms/typography/description.atom';
import { Header } from '@/ui/atoms/typography/header.atom';
import { YouTubePlayer } from '@/ui/molecules/youtube-video-player';

import { createStaggerContainer, fadeInUp, fadeIn, scaleIn } from '@/lib/utils/motion.util';

const featuresContainer = createStaggerContainer(0.05, 0.15);

const FEATURES = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Reflection Cards',
    desc: 'LoLo distills match timelines into strengths, focus areas, and one next habit using Bedrock-powered coach prompts.',
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Role Trend Dashboards',
    desc: 'Track monthly momentum, KP, CS, damage, and vision trends for your main roles without juggling dozens of charts.',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Shareable Recap Posters',
    desc: 'Export recap banners and pro comparisons to PNG so you can celebrate wins or plan scrims with the team.',
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
            <Header tag="h3" text="What LoLo Delivers" />
            <Description
              tag="p"
              text="Every screen is tuned for actionable insight—no stat dumps, just growth signals."
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
                    <Header tag="h3" text={item.title} className="text-2xl" />
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
