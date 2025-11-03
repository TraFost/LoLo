import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';

const data = [
  { stat: 'Fighting', player: 85, proPlayer: 65 },
  { stat: 'Farming', player: 70, proPlayer: 90 },
  { stat: 'Supporting', player: 90, proPlayer: 75 },
  { stat: 'Pushing', player: 60, proPlayer: 80 },
  { stat: 'Versatility', player: 80, proPlayer: 85 },
];

export default function ChartRadar() {
  const [showPlayer, setShowPlayer] = useState(true);
  const [showProPlayer, setShowProPlayer] = useState(true);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="h-96 w-full flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#555" />
            <PolarAngleAxis
              dataKey="stat"
              tick={{ fill: '#fff', fontSize: '0.9rem', fontWeight: 600 }}
            />

            {showPlayer && (
              <Radar
                name="Player Stats"
                dataKey="player"
                stroke="#38bdf8"
                fill="#38bdf8"
                fillOpacity={0.5}
              />
            )}
            {showProPlayer && (
              <Radar
                name="Pro Player Stats"
                dataKey="proPlayer"
                stroke="#f87171"
                fill="#f87171"
                fillOpacity={0.5}
              />
            )}

            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 items-center text-white">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showPlayer}
            onChange={() => setShowPlayer(!showPlayer)}
            className="accent-cyan-400 w-4 h-4"
          />
          <span className="text-cyan-400 font-medium">Player Stats</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showProPlayer}
            onChange={() => setShowProPlayer(!showProPlayer)}
            className="accent-rose-400 w-4 h-4"
          />
          <span className="text-rose-400 font-medium">Pro Player Stats</span>
        </label>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-950 border border-gray-700 text-white px-3 py-2 shadow-md">
        <p className="font-semibold">{payload[0].payload.stat}</p>
        {payload.map((entry, i: number) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}
