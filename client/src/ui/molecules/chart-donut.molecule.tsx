import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const ROLE_COLORS: string[] = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#f97316', // orange
  '#eab308', // yellow
  '#a855f7', // purple
];

type Props = {
  data: {
    role: string;
    value: number;
  }[];
  totalValues: number;
};

export function DonutChart({ data, totalValues }: Props) {
  return (
    <div className="flex items-center justify-center relative">
      <PieChart width={220} height={220}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="role"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.role}
              fill={ROLE_COLORS[index]}
              className="transition-all duration-200 hover:opacity-80"
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            `${((value / totalValues) * 100).toFixed(1)}% (${value} games)`
          }
          contentStyle={{
            backgroundColor: '#111827',
            border: '1px solid #374151',
          }}
          itemStyle={{ color: '#fff' }}
        />
      </PieChart>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center">
          <p className="text-sm text-gray-400">Total Games</p>
          <p className="text-2xl font-semibold text-white">{totalValues}</p>
        </div>
      </div>
    </div>
  );
}
