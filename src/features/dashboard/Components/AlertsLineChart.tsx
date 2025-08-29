import { LineChart } from "@/features/charts/LineChart";

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
