import { Progress } from '@/ui/atoms/progress';
import { DonutChart } from '@/ui/molecules/chart-donut.molecule';
import { ChartAreaLinear } from '@/ui/molecules/chart-linear.molecule';
import { useRoleStats } from '../hooks/useRoleStats';
import { ChevronUp } from 'lucide-react';
import { RoleDistribution } from 'shared/src/types/statistics.type';

const gameplay = {
  chartStatistics: {
    kda: [
      { month: 'January', value: 3.2 },
      { month: 'February', value: 2.9 },
      { month: 'March', value: 4.1 },
      { month: 'April', value: 3.8 },
      { month: 'May', value: 4.5 },
      { month: 'June', value: 2.9 },
      { month: 'July', value: 3.7 },
      { month: 'August', value: 3.1 },
      { month: 'September', value: 4.1 },
      { month: 'October', value: 2.2 },
      { month: 'November', value: 3.5 },
    ],
    net_worth: [
      { month: 'January', value: 8500 },
      { month: 'February', value: 9000 },
      { month: 'March', value: 12000 },
      { month: 'April', value: 11000 },
      { month: 'May', value: 12500 },
      { month: 'June', value: 14000 },
      { month: 'July', value: 14500 },
      { month: 'August', value: 11000 },
      { month: 'September', value: 14700 },
      { month: 'October', value: 10000 },
      { month: 'November', value: 11000 },
    ],
    cs: [
      { month: 'January', value: 230 },
      { month: 'February', value: 250 },
      { month: 'March', value: 270 },
      { month: 'April', value: 240 },
      { month: 'May', value: 260 },
      { month: 'June', value: 280 },
      { month: 'July', value: 200 },
      { month: 'August', value: 180 },
      { month: 'September', value: 190 },
      { month: 'October', value: 210 },
      { month: 'November', value: 220 },
    ],
  },
  roleDistribution: [
    { role: 'Jungle', value: 200 },
    { role: 'Mid', value: 100 },
    { role: 'Top', value: 80 },
    { role: 'ADC', value: 60 },
    { role: 'Support', value: 40 },
  ],
  analysis: {
    overall:
      'LoLo exhibits a balanced gameplay style with a strong emphasis on Jungle role, showcasing adaptability and strategic decision-making across various in-game scenarios.',
    strength: [
      'Exceptional map awareness and objective control as a Jungler.',
      'Consistent performance in mid-game team fights.',
      'Strong ability to adapt to different team compositions and strategies.',
    ],
    improvement: [
      {
        title: 'Improve 1',
        content: 'Enhance laning phase presence when playing Mid and Top roles.',
      },
      {
        title: 'Improve 2',
        content: 'Focus on vision control and ward placement in Support role.',
      },
      {
        title: 'Improve 33',
        content: 'Work on positioning during late-game team fights as ADC.',
      },
      {
        title: 'Improve 32',
        content: 'Work on positioning during late-game team fights as ADC.',
      },
      {
        title: 'Improve 31',
        content: 'Work on positioning during late-game team fights as ADC.',
      },
      {
        title: 'Improvew 3',
        content: 'Work on positioning during late-game team fights as ADC.',
      },
    ],
  },
};

interface Props {
  roleDistribution: RoleDistribution[];
}

export function GameplayOverview({ roleDistribution }: Props) {
  return (
    <section>
      <div className="my-24 mt-40 lg:px-52">
        <p className="text-5xl lg:text-7xl font-bold text-center">
          now, let's see how your gameplay really looks!
        </p>
      </div>
      <div className="mt-16 mx-4 lg:mx-24 flex flex-col lg:flex-row gap-6">
        <div className="basis-2/3">
          <div className="lg:w-3/4 mx-auto flex flex-col gap-12">
            <ChartAreaLinear data={gameplay.chartStatistics} />

            {/* Role Distribution Section */}
            <RoleDistributionSection roleDistribution={roleDistribution} />
          </div>
        </div>
        {/* LoLo Analysis Section */}
        <div className="w-fit flex-shrink-0 max-w-md">
          <h3 className="text-3xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">
            LoLo Analysis
          </h3>
          <div className="lg:max-h-[calc(100vh-6rem)] overflow-y-auto space-y-4 bg-gray-900 p-6 border border-gray-700">
            {/* Overall Summary */}
            <p className="text-base leading-relaxed text-gray-300">{gameplay.analysis.overall}</p>

            {/* Strength Section */}
            <div>
              <p className="text-lg font-semibold text-gray-100 mb-2">What Makes You Strong</p>
              <div className="flex flex-col gap-2">
                {gameplay.analysis.strength.map((point) => (
                  <div
                    key={point}
                    className="flex gap-3 items-center bg-gray-800 px-3 py-2 border border-gray-700"
                  >
                    <ChevronUp className="text-gray-400 shrink-0 lg:block hidden" size={20} />
                    <p className="text-gray-200 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Section */}
            <div>
              <p className="text-lg font-semibold text-gray-100 mb-2">Areas for Improvement</p>
              <div className="flex flex-col gap-3">
                {gameplay.analysis.improvement.map((point) => (
                  <div key={point.title} className="bg-gray-800 px-4 py-3 border border-gray-700">
                    <p className="font-semibold text-[#535aff] mb-1">{point.title}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{point.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleDistributionSection({ roleDistribution }: Props) {
  const { getPercentage, total } = useRoleStats(roleDistribution);
  return (
    <div className="space-y-6">
      <p className="text-2xl font-semibold">Role Distribution</p>
      <div className="w-full flex flex-col lg:flex-row gap-4">
        <DonutChart data={roleDistribution} totalValues={total} />
        <div className="w-full space-y-3">
          {roleDistribution.map((role) => (
            <div key={role.role} className="flex items-center w-full">
              <div className="w-2/12 pr-4">
                <p className="text-sm truncate">{role.role}</p>
              </div>
              <div className="flex items-center gap-4 w-2/3">
                <Progress value={getPercentage(role.value)} className="flex-1" />
                <p className="text-sm w-12 text-right">{getPercentage(role.value).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
