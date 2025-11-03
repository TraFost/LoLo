import { ChartConfig } from '@/ui/atoms/chart';
import { MonthlyMetric } from 'shared/src/types/statistics.type';

function camelToLabel(string: string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/\bKda\b/g, 'KDA')
    .replace(/\bCs\b/g, 'CS')
    .trim()
    .replace(/^./, (s) => s.toUpperCase());
}

export function chartHelper(metricsData: Record<string, MonthlyMetric[]>) {
  const metrics = Object.keys(metricsData);

  const chartConfig = Object.fromEntries(
    metrics.map((key) => [key, { label: camelToLabel(key), color: 'var(--color-primary)' }]),
  ) satisfies ChartConfig;

  const options = metrics.map((key) => ({
    label: camelToLabel(key),
    value: key,
  }));

  return { chartConfig, options };
}
