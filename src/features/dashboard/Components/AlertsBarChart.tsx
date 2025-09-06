import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AlertsBarChartProps {
  data: any[];
}

const AlertsBarChart: React.FC<AlertsBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Format the data for the bar chart
  const formattedData = data.map((item: any) => ({
    date: new Date(item.date || item.key).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    alerts: item.count || item.doc_count || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%" maxHeight={300}>
      <BarChart
        data={formattedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            color: 'hsl(var(--popover-foreground))',
          }}
          formatter={(value: any, name: any) => [value, 'Alerts']}
          labelFormatter={(label: any) => `Date: ${label}`}
        />
        <Bar 
          dataKey="alerts" 
          fill="hsl(var(--primary))" 
          radius={[4, 4, 0, 0]}
          opacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AlertsBarChart;