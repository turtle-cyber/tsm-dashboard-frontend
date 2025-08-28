import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Checkbox } from "@/ui/checkbox";
import { Button } from "@/ui/button";
import { SeverityBadge } from "@/ui/severity-badge";
import { Badge } from "@/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Filter, Plus, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { alertsTableData } from "@/data/mockData";

interface AlertsDataGridProps {
  onAlertSelect: (alertId: string) => void;
  selectedAlertId?: string;
}

export function AlertsDataGrid({
  onAlertSelect,
  selectedAlertId,
}: AlertsDataGridProps) {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("default");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(alertsTableData.map((alert) => alert.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  const handleSelectAlert = (alertId: string, checked: boolean) => {
    if (checked) {
      setSelectedAlerts([...selectedAlerts, alertId]);
    } else {
      setSelectedAlerts(selectedAlerts.filter((id) => id !== alertId));
    }
  };

  const isAllSelected = selectedAlerts.length === alertsTableData.length;
  const isSomeSelected =
    selectedAlerts.length > 0 && selectedAlerts.length < alertsTableData.length;

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Time Range Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Dec 2, 2024 12:00 AM - Dec 3, 2024 12:00 AM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  Dec 2, 2024 12:00 AM - Dec 3, 2024 12:00 AM
                </SelectItem>
                <SelectItem value="last-hour">Last Hour</SelectItem>
                <SelectItem value="last-24-hours">Last 24 Hours</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" className="h-8">
            Default Filter
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Group By */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Group by</span>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              Add column
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedAlerts.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Actions
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                <DropdownMenuItem>Assign to Analyst</DropdownMenuItem>
                <DropdownMenuItem>Export Selected</DropdownMenuItem>
                <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Items Count */}
          <span className="text-sm text-muted-foreground">
            {alertsTableData.length.toLocaleString()} Items
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className={
                    isSomeSelected
                      ? "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary"
                      : ""
                  }
                />
              </TableHead>
              <TableHead>Reported Time</TableHead>
              <TableHead>Alert Name</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>MITRE Technique</TableHead>
              <TableHead>AI Verdict</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertsTableData.map((alert) => (
              <TableRow
                key={alert.id}
                className={`cursor-pointer transition-colors ${
                  selectedAlertId === alert.id
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => onAlertSelect(alert.id)}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedAlerts.includes(alert.id)}
                    onCheckedChange={(checked) =>
                      handleSelectAlert(alert.id, checked as boolean)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {alert.reportedTime}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-primary hover:underline">
                      {alert.alertName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <SeverityBadge severity={alert.severity}>
                    {alert.severity.charAt(0).toUpperCase() +
                      alert.severity.slice(1)}
                  </SeverityBadge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {alert.mitreTechnique}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-primary">
                      {alert.verdict}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={alert.status === "new" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {alert.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Investigate</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                      <DropdownMenuItem>Assign</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
