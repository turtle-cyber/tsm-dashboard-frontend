import React, { useEffect, useRef, useState } from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarRadiusAxis,
  Label,
} from "recharts";

type Contributor = { label: string; value: number; color: string };

const chartData = [{ name: "Score", value: 70 }];
const contributors: Contributor[] = [
  { label: "Memory Injection", value: 62, color: "#f97316" },
  { label: "Memory Leak", value: 32, color: "#00aa7f" },
  { label: "Script Execution", value: 31, color: "#00557f" },
  { label: "Abnormal Behaviour", value: 52, color: "#b67542" },
  { label: "Network IOC", value: 32, color: "#55557f" },
];

function ContributorsList({ data }: { data: Contributor[] }) {
  return (
    <div className="w-full mx-auto h-28 overflow-y-auto px-1">
      {data.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
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

// Semicircle component (reusing from previous)

const Semicircle: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  fillColor?: string;
  className?: string;
  animationDuration?: number; // in ms
}> = ({
  percentage,
  size = 200,
  strokeWidth = 20,
  backgroundColor = "#5D89DF",
  fillColor = "#5D89DF",
  className = "",
  animationDuration = 1000, // default 1s
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const targetAngle = (clampedPercentage / 100) * 180;

  const [animatedAngle, setAnimatedAngle] = useState(0);
  const requestRef = useRef<number>();

  // Animate from 0 → target
  useEffect(() => {
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / animationDuration, 1);
      setAnimatedAngle(progress * targetAngle);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(step);
      }
    };

    cancelAnimationFrame(requestRef.current!);
    requestRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(requestRef.current!);
  }, [targetAngle, animationDuration]);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const startX = center - radius;
  const startY = center;

  const endAngle = Math.PI - (animatedAngle * Math.PI) / 180;
  const endX = center + radius * Math.cos(endAngle);
  const endY = center - radius * Math.sin(endAngle);

  const largeArcFlag = animatedAngle > 180 ? 1 : 0;

  let fillPath = "";
  if (animatedAngle > 0) {
    fillPath = `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  }

  const gradientId = `radialGradient-${size}-${Math.random()}`;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size / 2 + strokeWidth / 2}>
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor={fillColor} stopOpacity="0" />
            <stop offset="40%" stopColor={fillColor} stopOpacity="0.1" />
            <stop offset="60%" stopColor={fillColor} stopOpacity="0.3" />
            <stop offset="80%" stopColor={fillColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.7" />
          </radialGradient>
        </defs>

        {/* Base semicircle outline */}
        <path
          d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${
            center + radius
          } ${center}`}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Animated fill */}
        {animatedAngle > 0 && (
          <path
            d={fillPath}
            fill={`url(#${gradientId})`}
            stroke="none"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
};

const ConfidenceGauge: React.FC = () => {
  // tune these for thickness/look
  const OUTER = 120; // px
  const TRACK_THICK = 20; // px  (overall grey track thickness)
  const BAND_THICK = TRACK_THICK / 2; // px (colored band = outer half of track)

  const TRACK_INNER = OUTER - TRACK_THICK;
  const BAND_INNER = OUTER - BAND_THICK;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-full h-36">
        {/* soft inner glow */}
        <div className="absolute inset-0 flex justify-center items-start pt-9 pointer-events-none">
          <Semicircle
            percentage={chartData[0].value}
            size={200}
            strokeWidth={2}
            backgroundColor="transparent"
            fillColor="#5D89DF"
          />
        </div>

        {/* BACKGROUND TRACK (thick, grey) */}
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="absolute inset-0"
        >
          <RadialBarChart
            data={[{ value: 100 }]}
            cx="50%"
            cy="95%"
            innerRadius={TRACK_INNER}
            outerRadius={OUTER + 4}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              fill="#e5e7eb"
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* PROGRESS BAND (thin, colored, only outer half) */}
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="absolute inset-0"
        >
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="95%"
            innerRadius={BAND_INNER - 5}
            outerRadius={OUTER + 8}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              fill="#5D89DF"
              background={false}
              // cornerRadius={BAND_THICK}
            />

            {/* center labels */}
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy - 50}
                          className="fill-muted-foreground text-sm"
                        >
                          Score
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy - 15}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].value}%
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <ContributorsList data={contributors} />
    </div>
  );
};

export default ConfidenceGauge;
