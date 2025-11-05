import { Progress } from '@/ui/atoms/progress';
import { DonutChart } from '@/ui/molecules/chart-donut.molecule';
import { ChartAreaLinear } from '@/ui/molecules/chart-linear.molecule';
import { useRoleStats } from '../hooks/role/use-role-stats.hook';
import { ChevronUp } from 'lucide-react';
import { GameplayData, RoleDistribution } from 'shared/src/types/statistics.type';
import { usePostAnalyze } from '../hooks/analyze/use-post-analyze.hook';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import LoloIcon from '@/ui/molecules/lolo-icon.molecule';
import { motion } from 'motion/react';

interface RoleDistributionProps {
  roleDistribution: RoleDistribution[];
}

interface Props {
  gameplayData: GameplayData;
}

export function GameplayOverview({ gameplayData }: Props) {
  const { chartStatistics, roleDistribution } = gameplayData;

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
            <ChartAreaLinear chartStatistics={chartStatistics} />

            {/* Role Distribution Section */}
            <RoleDistributionSection roleDistribution={roleDistribution} />
          </div>
        </div>

        {/* LoLo Analysis Section */}
        <LoLoAnalysis />
      </div>
    </section>
  );
}

function RoleDistributionSection({ roleDistribution }: RoleDistributionProps) {
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

function LoLoAnalysis() {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { data: gameplay, mutate, isPending, isError, error } = usePostAnalyze();

  useEffect(() => {
    if (inView) {
      mutate();
    }
  }, [inView, mutate]);

  return (
    <div className="w-full flex-shrink-0 max-w-md" ref={ref}>
      <h3 className="text-3xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">
        LoLo Analysis
      </h3>
      <div className="lg:max-h-[calc(100vh-6rem)] max-w-md w-full overflow-y-auto space-y-4 bg-gray-900 p-6 border border-gray-700">
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="w-24">
              <LoloIcon animation="spin" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-yellow-400 to-primary text-transparent bg-clip-text"
            >
              Analyzing your playstyle...
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '8rem' }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              className="h-1 bg-gradient-to-r from-yellow-400 to-primary rounded-full mt-2"
            />
          </div>
        )}

        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-2 py-20 text-center"
          >
            <p className="text-red-400 font-semibold text-lg">Something went wrong</p>
            <p className="text-slate-400 text-sm max-w-md">{error.message}</p>
          </motion.div>
        )}

        {gameplay && (
          <>
            {/* Overall Summary */}
            <p className="text-base leading-relaxed text-gray-300">{gameplay.analysis.overall}</p>

            {/* Strength Section */}
            <div>
              <p className="text-lg font-semibold text-gray-100 mb-2">What Makes You Strong</p>
              <div className="flex flex-col gap-2">
                {gameplay.analysis.strengths.map((point) => (
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
                  <div key={point} className="bg-gray-800 px-4 py-3 border border-gray-700">
                    <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
