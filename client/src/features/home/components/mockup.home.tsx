import { Zap, Trophy, Star, MapPin } from 'lucide-react';

const stats = [
  { label: 'Average KDA', value: '5.2', icon: <Zap className="w-10 h-10 text-primary" /> },
  { label: 'Win Rate', value: '62%', icon: <Trophy className="w-10 h-10 text-primary" /> },
  { label: 'Top Champion', value: 'Ahri', icon: <Star className="w-10 h-10 text-primary" /> },
  {
    label: 'Most Active Lane',
    value: 'Mid',
    icon: <MapPin className="w-10 h-10 text-primary" />,
  },
];

export default function MockupSection() {
  return (
    <section className="text-white py-24 px-8 md:px-24">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-extrabold tracking-widest text-primary mb-4">
          AI Match Insights
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Mockup showing how AI interprets player statistics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 border-2 border-white p-6 shadow-[6px_6px_0_0_#535AFF]"
            >
              {stat.icon}
              <div>
                <p className="text-gray-300">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-2 border-white p-8 shadow-[6px_6px_0_0_#535AFF] flex flex-col justify-center text-center">
          <p className="text-lg font-semibold mb-2">AI Insight</p>
          <p className="text-base">
            Player performs best in Mid lane with Ahri. Focus training on KDA improvement and
            champion mastery to increase win rate.
          </p>
        </div>
      </div>
    </section>
  );
}
