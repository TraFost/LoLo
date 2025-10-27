import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const stats = [
  {
    title: 'Total Games',
    value: '1,247',
    subtitle: 'Across all queues',
  },
  {
    title: 'Win Rate',
    value: '54.3%',
    subtitle: '++2.1% from last year',
  },
  {
    title: 'Total Kills',
    value: '8,942',
    subtitle: '7.2 per game',
  },
  {
    title: 'Pentakills',
    value: '12',
    subtitle: 'One man army!',
  },
  {
    title: 'Hours Played',
    value: '487',
    subtitle: "That's 20 days!",
  },
];

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

export function HorizontalScroll() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);

  return (
    <section ref={ref} className="relative h-[700vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex items-center">
          {stats.map((stat, i) => (
            <TextBlock key={i} title={stat.title} value={stat.value} subtitle={stat.subtitle} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TextBlock({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="flex-shrink-0 w-screen flex flex-col items-center justify-center px-8">
      <motion.p
        className="text-2xl md:text-3xl font-semibold mb-2 text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.p>

      <motion.p
        className={`text-8xl lg:text-9xl font-bold mb-4 'text-white`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.1, delay: 0.2 }}
      >
        {value}
      </motion.p>

      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
