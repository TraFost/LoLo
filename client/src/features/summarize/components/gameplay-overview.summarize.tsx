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
import { AnalysisDTO, PracticePlanPayload } from 'shared/src/types/analyze.dto';

interface Props {
  gameplayData: GameplayData;
}

interface RoleDistributionProps {
  roleDistribution: RoleDistribution[];
}

interface AnalyzeProps {
  isPending: boolean;
  isError: boolean;
  error?: string;
}

interface LoLoAnalysisProps extends AnalyzeProps {
  analysis: AnalysisDTO;
}

interface PracticePlanProps {
  practicePlan: PracticePlanPayload;
}

export function GameplayOverview({ gameplayData }: Props) {
  const { chartStatistics, roleDistribution } = gameplayData;

  const { ref, inView } = useInView({ triggerOnce: true });
  const { data, mutate, isPending, isError, error } = usePostAnalyze();

  useEffect(() => {
    if (inView) {
      mutate();
    }
  }, [inView, mutate]);

  const { analysis, practicePlan } = data ?? {};

  return (
    <section ref={ref}>
      <div className="my-24 mt-40 lg:px-52">
        <p className="text-5xl lg:text-7xl font-bold text-center">
          now, let's see how your analysis really looks!
        </p>
      </div>
      <div className="mt-16 mx-4 lg:mx-24 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="basis-2/3">
            <div className="lg:w-3/4 mx-auto flex flex-col gap-12">
              <ChartAreaLinear chartStatistics={chartStatistics} />

              {/* Role Distribution Section */}
              <RoleDistributionSection roleDistribution={roleDistribution} />
            </div>
          </div>

          {/* LoLo Analysis Section */}
          <LoLoAnalysis
            analysis={analysis!}
            error={error?.message}
            isError={isError}
            isPending={isPending}
          />
        </div>
        {practicePlan && (
          <div>
            <PracticePlan practicePlan={practicePlan} />
          </div>
        )}
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

function LoLoAnalysis({ analysis, error, isError, isPending }: LoLoAnalysisProps) {
  return (
    <div className="w-full flex-shrink-0 max-w-md">
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
            <p className="text-slate-400 text-sm max-w-md">{error}</p>
          </motion.div>
        )}

        {analysis && (
          <>
            {/* Overall Summary */}
            <p className="text-base leading-relaxed text-gray-300">{analysis.analysis.overall}</p>

            {/* Strength Section */}
            <div>
              <p className="text-lg font-semibold text-gray-100 mb-2">What Makes You Strong</p>
              <div className="flex flex-col gap-2">
                {analysis.analysis.strengths.map((point) => (
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
                {analysis.analysis.improvement.map((point) => (
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

function PracticePlan({ practicePlan }: PracticePlanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto bg-gray-900 border border-gray-700 p-8 shadow-lg space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-semibold text-white">Practice Plan</h3>
        <p className="text-gray-400 text-sm">Your personal improvement roadmap</p>
      </div>

      {/* Focus Section */}
      <div>
        <p className="text-lg font-semibold text-gray-100 mb-2">Key Focus Areas</p>
        <div className="flex flex-wrap gap-2">
          {practicePlan.focus.map((focus) => (
            <span
              key={focus}
              className="px-3 py-1 text-sm font-medium text-primary bg-gray-800 border border-gray-700"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      {/* Session Section */}
      <div className="space-y-6">
        <p className="text-lg font-semibold text-gray-100">Training Sessions</p>
        {practicePlan.sessions.map((session, idx) => (
          <motion.div
            key={session.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-800 border border-gray-700 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">{session.title}</h4>
              <span className="text-sm text-gray-400">{session.duration}</span>
            </div>
            <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
              {session.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Notes Section */}
      <div className="border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400 italic">{practicePlan.notes}</p>
      </div>
    </motion.div>
  );
}
