import React from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

type Contributor = { label: string; value: number; color: string };

const chartData = [{ name: "Score", value: 70 }];
const contributors: Contributor[] = [
  { label: "Memory Injection", value: 62, color: "#f97316" },
  { label: "Memory Leak", value: 32, color: "#b97342" },
  { label: "Memory Leak", value: 32, color: "#b97342" },
  { label: "Memory Leak", value: 32, color: "#b97342" },
  { label: "Memory Leak", value: 32, color: "#b97342" },
  { label: "Memory Leak", value: 32, color: "#b97342" },
  { label: "Memory Leak", value: 32, color: "#b97342" },
];

function ContributorsList({ data }: { data: Contributor[] }) {
  return (
    <div className="w-full mx-auto h-32 overflow-y-auto space-y-1 px-1 py-1">
      {data.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-md transition py-1 px-2 hover:bg-white/5 hover:ring-1 hover:ring-border"
        >
          <span className="w-48 text-sm truncate" title={item.label}>
            {item.label}
          </span>
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${Math.max(0, Math.min(100, item.value))}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <span className="w-10 text-right text-sm">
            {Math.round(item.value)}%
          </span>
        </div>
      ))}
    </div>
  );
}

const ConfidenceGauge: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Gauge: fully responsive via aspect ratio (no fixed px sizes) */}
      <div className="w-full flex items-center justify-center">
        <div className="w-full h-48 items-center">
          <ResponsiveContainer
            width="100%"
            height="100%"
            className="items-center flex"
          >
            <RadialBarChart
              data={chartData}
              cx="50%"
              cy="80%" // center at bottom for a clean semicircle
              innerRadius="120" // % keeps it responsive
              outerRadius="150"
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                fill="#6366f1"
                background={true}
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contributors (compact, centered, scrolls if long) */}
      <ContributorsList data={contributors} />
    </div>
  );
};

export default ConfidenceGauge;
