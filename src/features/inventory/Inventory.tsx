import { useState } from "react";
import { Download, Settings, HelpCircle, RotateCw, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Badge } from "@/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { DonutChart } from "@/features/charts/DonutChart";
import { Alert, AlertDescription } from "@/ui/alert";
import { Input } from "@/ui/input";
import {
  mockDevices,
  securedStateData,
  deviceReviewData,
  deviceTypeData,
  osTypeData,
  type DeviceData,
} from "@/data/mockInventoryData";
import { cn } from "@/lib/utils";

const getDeviceIcon = (type: string) => {
  switch (type) {
    case "workstation":
      return "🖥️";
    case "server":
      return "🖥️";
    case "smart_home":
      return "🏠";
    case "iot":
      return "📱";
    case "mobile":
      return "📱";
    default:
      return "💻";
  }
};

const getOSIcon = (osType: string) => {
  switch (osType) {
    case "windows":
      return "🟦";
    case "linux":
      return "🐧";
    case "macos":
      return "🍎";
    case "android":
      return "🤖";
    case "embedded":
      return "⚡";
    default:
      return "❓";
  }
};

const getSecurityStateColor = (state: string) => {
  switch (state) {
    case "secured":
      return "text-green-400 bg-green-400/10";
    case "unsupported":
      return "text-yellow-400 bg-yellow-400/10";
    case "unsecured":
      return "text-red-400 bg-red-400/10";
    default:
      return "text-muted-foreground bg-muted/10";
  }
};

const securedStateChartData = [
  {
    name: "Secured",
    value: securedStateData.secured,
    color: "hsl(var(--chart-1))",
    percentage: (securedStateData.secured / securedStateData.total) * 100,
  },
  {
    name: "Unsupported",
    value: securedStateData.unsupported,
    color: "hsl(var(--chart-3))",
    percentage: (securedStateData.unsupported / securedStateData.total) * 100,
  },
  {
    name: "Unsecured",
    value: securedStateData.unsecured,
    color: "hsl(var(--chart-2))",
    percentage: (securedStateData.unsecured / securedStateData.total) * 100,
  },
];

export default function Inventory() {
  const [sortBy, setSortBy] = useState("latest");
  const [filterValue, setFilterValue] = useState("");

  const filteredDevices = mockDevices.filter(
    (device) =>
      device.hostName.toLowerCase().includes(filterValue.toLowerCase()) ||
      device.ip.includes(filterValue) ||
      device.manufacturer.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">DEVICE INVENTORY</h1>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="ip">IP Address</SelectItem>
              <SelectItem value="status">Security Status</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Select filters...
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Secured State */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Secured State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={securedStateChartData}
              innerRadius={40}
              outerRadius={70}
              centerText={{
                line1: "TOTAL:",
                line2: securedStateData.total.toString(),
              }}
              showLegend={false}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                  <span>Secured</span>
                </div>
                <span className="font-medium">{securedStateData.secured}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                  <span>Unsupported</span>
                </div>
                <span className="font-medium">
                  {securedStateData.unsupported}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                  <span>Unsecured</span>
                </div>
                <span className="font-medium">
                  {securedStateData.unsecured}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Review */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Device Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={deviceReviewData.map((item) => ({
                ...item,
                percentage: (item.value / 35) * 100,
              }))}
              innerRadius={40}
              outerRadius={70}
              centerText={{
                line1: "TOTAL:",
                line2: "35",
              }}
              showLegend={false}
            />
          </CardContent>
        </Card>

        {/* Devices by Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Devices (Total: 35)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={deviceTypeData.map((item) => ({
                ...item,
                percentage: (item.value / 35) * 100,
              }))}
              innerRadius={40}
              outerRadius={70}
              showLegend={false}
            />
          </CardContent>
        </Card>

        {/* OS Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              OS Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={osTypeData.map((item) => ({
                ...item,
                percentage: (item.value / 35) * 100,
              }))}
              innerRadius={40}
              outerRadius={70}
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Network Scan Status */}
      <Alert>
        <RotateCw className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              Scanning Network... Latest scan finished at Aug 9, 2023 21:43
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">35 Items</span>
              <span className="text-sm text-muted-foreground">20 Results</span>
              <Button variant="outline" size="sm">
                Columns
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search devices..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Devices Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-12"></TableHead>
                <TableHead>Type</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Device Function</TableHead>
                <TableHead>OS Version</TableHead>
                <TableHead>Secured State</TableHead>
                <TableHead>Host Names</TableHead>
                <TableHead>Network N...</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Device Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow
                  key={device.id}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getDeviceIcon(device.type)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {device.ip}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getOSIcon(device.osType)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {device.deviceFunction}
                  </TableCell>
                  <TableCell className="text-sm">{device.osVersion}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-xs",
                        getSecurityStateColor(device.securedState)
                      )}
                    >
                      {device.securedState.charAt(0).toUpperCase() +
                        device.securedState.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{device.hostName}</TableCell>
                  <TableCell className="text-sm">
                    {device.networkName}
                  </TableCell>
                  <TableCell className="text-sm">
                    {device.manufacturer}
                  </TableCell>
                  <TableCell className="text-sm">{device.domain}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {device.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
