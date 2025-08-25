import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";

type LegendPosition = "left" | "right" | "top" | "bottom";

// Accessors let the chart work with any data shape
type DonutChartProps<T = any> = {
  data: T[];
  getLabel?: (d: T) => string;
  getValue?: (d: T) => number;
  getColor?: (d: T, index: number) => string;

  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  chartHeight?: number;
  legendPosition?: LegendPosition;
};

const DEFAULT_COLORS = [
  "#a465ce",
  "#5c3e77",
  "#facc15",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
];

/* ---------- helpers: fade-to-white + geometry ---------- */
function hexToRgb(hex: string) {
  const m = hex.replace("#", "");
  const v = parseInt(
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m,
    16
  );
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const f = (n: number) => n.toString(16).padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}
function fadeToWhite(hex: string, factor: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: Math.round(r + (255 - r) * factor),
    g: Math.round(g + (255 - g) * factor),
    b: Math.round(b + (255 - b) * factor),
  });
}

/** Custom active shape: smooth pop‑out + slight grow */
const renderActiveShape = (props: any) => {
  const RAD = Math.PI / 180;
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    midAngle,
    fill,
  } = props;

  const bump = 8; // pop-out distance
  const grow = 6; // extra radius when active
  const dx = Math.cos(-midAngle * RAD) * bump;
  const dy = Math.sin(-midAngle * RAD) * bump;

  return (
    <g
      transform={`translate(${dx},${dy}) scale(1.035)`}
      style={{ transition: "transform 260ms cubic-bezier(.2,.8,.2,1)" }}
    >
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + grow}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const CustomTooltip = ({
  active,
  payload,
}: { active?: boolean; payload?: any[] } = {}) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-card-foreground">
          {d.name}: {d.value}
        </p>
        <p className="text-xs text-muted-foreground">
          {d.payload?.percentage?.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

/** Center label ("Total" and number) */
const renderCenterLabel = (total: number) => (props: any) => {
  const { cx, cy } = props;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} dy="-0.4em" className="text-xs fill-muted-foreground">
        Total
      </tspan>
      <tspan
        x={cx}
        dy="1.2em"
        className="text-md font-bold fill-card-foreground"
      >
        {total}
      </tspan>
    </text>
  );
};

export function DonutChart<T = any>({
  data,
  getLabel = (d: any) => d?.alert ?? String(d?.name ?? d?.id ?? ""),
  getValue = (d: any) => Number(d?.value ?? d?.count ?? 0),
  getColor = (_: T, i: number) => DEFAULT_COLORS[i % DEFAULT_COLORS.length],

  innerRadius = 60,
  outerRadius = 120,
  showLegend = true,
  showTooltip = true,
  chartHeight = 250,
  legendPosition = "right",
}: DonutChartProps<T>) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]); // multi-select lock

  const values = useMemo(() => data.map(getValue), [data, getValue]);
  const labels = useMemo(() => data.map(getLabel), [data, getLabel]);

  const total = useMemo(
    () => values.reduce((acc, v) => acc + Number(v || 0), 0),
    [values]
  );

  const chartData = useMemo(
    () =>
      data.map((d, i) => ({
        name: labels[i],
        value: values[i],
        color: getColor(d, i),
        percentage: total > 0 ? (values[i] / total) * 100 : 0,
      })),
    [data, labels, values, total, getColor]
  );

  // active indices = union(selected, hovered)
  const activeSet = useMemo(() => {
    const s = new Set<number>(selected);
    if (hoverIndex !== null) s.add(hoverIndex);
    return s;
  }, [selected, hoverIndex]);
  const activeIndex = useMemo(() => Array.from(activeSet), [activeSet]);

  // Layout for legend placement
  const isHorizontal = legendPosition === "top" || legendPosition === "bottom";
  const containerClass =
    legendPosition === "left"
      ? "grid grid-cols-[220px_1fr] items-center gap-6"
      : legendPosition === "right"
      ? "grid grid-cols-[1fr_220px] items-center gap-6"
      : "flex flex-col gap-4";

  const toggleSelect = (idx: number) =>
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );

  const fadeFactor = 0.45;

  const LegendBox = (
    <div className="min-w-[200px]">
      <div className="space-y-1">
        {chartData.map((d, idx) => {
          const isActive = activeSet.size === 0 ? true : activeSet.has(idx);
          const isSelected = selected.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => toggleSelect(idx)}
              className={`flex w-full items-center gap-3 rounded-md px-1 py-1 text-left transition duration-200 ${
                isActive ? "opacity-100" : "opacity-70"
              } ${isSelected ? "ring-1 ring-border" : ""}`}
              style={{ transitionProperty: "opacity, box-shadow" }}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-sm text-muted-foreground flex-1">
                {d.name}
              </span>
              <span className="text-sm text-muted-foreground font-semibold">
                {d.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const ChartBox = (
    <div className={isHorizontal ? "w-full" : "w-full"}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            startAngle={90} // sweep 0→360
            endAngle={-270}
            isAnimationActive
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
            activeIndex={activeIndex} // supports number[]
            activeShape={renderActiveShape}
            // onMouseLeave={() => setHoverIndex(null)}
            // onMouseEnter={(_, idx) => setHoverIndex(idx)}
            onClick={(_, idx) => toggleSelect(idx)}
            label={renderCenterLabel(total)} // center Total
          >
            {chartData.map((entry, index) => {
              const isActive =
                activeSet.size === 0 ? true : activeSet.has(index);
              const fill = isActive
                ? entry.color
                : fadeToWhite(entry.color, fadeFactor);
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={fill}
                  style={{ transition: "fill 200ms cubic-bezier(.2,.8,.2,1)" }}
                />
              );
            })}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className={`w-full h-full ${containerClass}`}>
      {legendPosition === "left" && showLegend && LegendBox}
      {legendPosition === "top" && showLegend && LegendBox}
      {ChartBox}
      {legendPosition === "right" && showLegend && LegendBox}
      {legendPosition === "bottom" && showLegend && LegendBox}
    </div>
  );
}
