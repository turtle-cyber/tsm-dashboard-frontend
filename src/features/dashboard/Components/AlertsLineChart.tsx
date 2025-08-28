import { LineChart } from "@/features/charts/LineChart";
import React from "react";

const mockData = [
  { date: "8 May", critical: 49 },
  { date: "9 May", critical: 65 },
  { date: "10 May", critical: 52 },
  { date: "11 May", critical: 90 },
  { date: "12 May", critical: 70 },
  { date: "13 May", critical: 80 },
];

const lineConfigs = [
  {
    dataKey: "count",
    color: "#ef4444",
    name: "Alerts Count",
    strokeWidth: 2,
  },
];

const AlertsLineChart = ({ data = [] }) => {
  return (
    <>
      <LineChart
        data={data}
        chartType="linear"
        lines={lineConfigs}
        xAxisKey="date"
        height={330}
        showGrid={true}
        showLegend={false}
        showTooltip={true}
      />
    </>
  );
};

export default AlertsLineChart;
