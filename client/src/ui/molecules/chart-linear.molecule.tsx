import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/atoms/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/ui/atoms/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/atoms/select';
import { useState } from 'react';

export const description = 'A linear area chart';

type MetricKey = 'kda' | 'net_worth' | 'cs';
type ChartDataPoint = {
  month: string;
  value: number;
};

const chartConfig = {
  kda: { label: 'KDA', color: 'var(--color-primary)' },
  net_worth: { label: 'Net Worth', color: 'var(--color-primary)' },
  cs: { label: 'CS', color: 'var(--color-primary)' },
} satisfies ChartConfig;

const options: { label: string; value: MetricKey }[] = [
  { label: 'KDA', value: 'kda' },
  { label: 'Net Worth', value: 'net_worth' },
  { label: 'CS', value: 'cs' },
];

type Props = {
  data: Record<MetricKey, ChartDataPoint[]>;
};

export function ChartAreaLinear({ data }: Props) {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const currentData = data[selectedOption.value];
  const currentConfig = chartConfig[selectedOption.value];

  return (
    <Card className="lg:p-4">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-gray-800">
        <div>
          <CardTitle className="text-white text-2xl font-semibold tracking-tight">
            {currentConfig.label} Trend
          </CardTitle>
          <CardDescription className="text-gray-400">Your performance overview</CardDescription>
        </div>

        <Select
          defaultValue={selectedOption.value}
          onValueChange={(value) => setSelectedOption(options.find((o) => o.value === value)!)}
        >
          <SelectTrigger>
            <SelectValue placeholder={selectedOption.label} />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1b1e] text-gray-200 border-gray-700">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="hover:bg-gray-800 cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="pt-2">
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={currentData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#2a2b2e" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={{ stroke: '#374151', strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0];
                return (
                  <div className="rounded-md border border-gray-700 bg-[#1a1b1e] px-3 py-2 text-sm text-gray-100">
                    <p className="text-gray-500 text-xs">{data.payload.month}</p>
                    <p className="font-medium">
                      {currentConfig.label}: <span className="text-white">{data.value}</span>
                    </p>
                  </div>
                );
              }}
            />
            <Area
              dataKey="value"
              type="linear"
              stroke={currentConfig.color}
              strokeWidth={2}
              fill={currentConfig.color}
              fillOpacity={0.15}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
