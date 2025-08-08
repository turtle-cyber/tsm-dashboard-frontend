import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface DonutChartData {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  chartHeight?: number;
  centerText?: {
    line1: string;
    line2: string;
  };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-card-foreground">
          {data.name}: {data.value}
        </p>
        <p className="text-xs text-muted-foreground">
          {data.payload.percentage?.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.value} {entry.payload.percentage?.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export function DonutChart({
  data,
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
  showTooltip = true,
  chartHeight = 250,
  centerText,
}: DonutChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend content={<CustomLegend />} />}
        </PieChart>
      </ResponsiveContainer>

      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {centerText.line1}
            </div>
            <div className="text-sm text-muted-foreground">
              {centerText.line2}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
