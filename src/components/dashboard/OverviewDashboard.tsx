import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown, Copy, AlertTriangle, AlertCircle, Users } from "lucide-react";
import {
  severityData,
  classificationData,
  alertsOverTimeData,
  alertsTimeLineConfig,
  highValueAssetsData,
  agentsAttentionData
} from "@/data/mockData";

const getRiskIcon = (iconName: string) => {
  switch (iconName) {
    case "crown":
      return <Crown className="h-4 w-4 text-high" />;
    case "copy":
      return <Copy className="h-4 w-4 text-medium" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-high" />;
    case "alert-circle":
      return <AlertCircle className="h-4 w-4 text-critical" />;
    case "users":
      return <Users className="h-4 w-4 text-medium" />;
    default:
      return null;
  }
};

export function OverviewDashboard() {
  // Prepare classification data with percentages
  const classificationDataWithPercentages = classificationData.map(item => ({
    ...item,
    percentage: item.value
  }));

  // Prepare agents attention data with percentages
  const agentsDataWithPercentages = agentsAttentionData.map(item => ({
    ...item,
    percentage: item.value
  }));

  return (
    <div className="space-y-6">
      {/* First Row - 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts by Severity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Alerts by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {severityData.map((item) => (
                <div key={item.severity} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <SeverityBadge severity={item.severity.toLowerCase() as any}>
                      {item.severity}
                    </SeverityBadge>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts by Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Alerts by Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={classificationDataWithPercentages}
              innerRadius={50}
              outerRadius={80}
              showLegend={false}
            />
          </CardContent>
        </Card>

        {/* Critical and High Alerts Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Critical and High Alerts Created Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={alertsOverTimeData}
              lines={alertsTimeLineConfig}
              xAxisKey="time"
              height={200}
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Second Row - 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top High-Value Assets With Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top High-Value Assets With Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Unresolved Alerts</TableHead>
                  <TableHead>Risk Factors</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highValueAssetsData.map((asset, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {asset.assetName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{asset.assetName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted/50">
                        {asset.unresolvedAlerts}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {asset.riskFactors.map((icon, iconIndex) => (
                          <div key={iconIndex}>
                            {getRiskIcon(icon)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {asset.category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Agents Requiring Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Agents Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={agentsDataWithPercentages}
              innerRadius={60}
              outerRadius={100}
              showLegend={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}