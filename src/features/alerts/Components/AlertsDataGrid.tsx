import { useCallback, useEffect, useState } from "react";
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
import {
  Filter,
  Plus,
  ChevronDown,
  MoreHorizontal,
  ArrowDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
// import { alertsTableData } from "@/data/mockData";
import { http } from "@/lib/config";
import { GET_HIGH_CRTICAL_ALERTS } from "../alertsEndpoints";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/ui/tooltip";

interface AlertsDataGridProps {
  onAlertSelect: (alertId: string) => void;
  selectedAlertId?: string;
}

const useGetHighCriticalAlerts = () => {
  const [alertsTableData, setAlertsTableData] = useState<any>([]);
  const [highCriticalLoading, setHighCriticalLoading] = useState(false);

  const fetchAgents = useCallback(async () => {
    setHighCriticalLoading(true);
    try {
      const response = await http.get(GET_HIGH_CRTICAL_ALERTS);

      setAlertsTableData(response?.data?.hits || []);
      console.log(response);
    } catch (error) {
      console.error("Error fetching top agents:", error);
    } finally {
      setHighCriticalLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, []);

  return { alertsTableData, highCriticalLoading, refetch: fetchAgents };
};

export function AlertsDataGrid({
  onAlertSelect,
  selectedAlertId,
}: AlertsDataGridProps) {
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("default");
  const [automatedActionPopoverOpen, setAutomatedActionPopoverOpen] =
    useState(false);
  const [customActionPopoverOpen, setCustomActionPopoverOpen] = useState(false);

  const { alertsTableData, highCriticalLoading } = useGetHighCriticalAlerts();

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
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertsTableData.map((alert) => (
              <TableRow
                key={alert.id}
                className={`cursor-pointer transition-colors ${
                  selectedAlertId === alert.id
                    ? "bg-primary/5 border-l-2"
                    : "hover:bg-muted/50"
                }`}
                // onClick={() => onAlertSelect(alert.id)}
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
                  {alert.timestamp}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium hover:underline">
                      {alert.alertDescription}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <SeverityBadge severity={alert.severity.toLowerCase()}>
                    {alert.severity.charAt(0).toUpperCase() +
                      alert.severity.slice(1)}
                  </SeverityBadge>
                </TableCell>
                <TableCell className="items-center">
                  <Badge variant="outline" className="font-mono">
                    {alert.mitreId}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-primary">
                      {alert.verdict ? alert.verdict : "-"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-20 bg-primary"
                      >
                        Action
                        <ArrowDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setAutomatedActionPopoverOpen(true)}
                      >
                        Automated Action
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCustomActionPopoverOpen(true)}
                      >
                        Add Playbook
                      </DropdownMenuItem>
                      <DropdownMenuItem>Ignore</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* {automatedActionPopoverOpen && (
                    <AutomatedActionPopover
                      onClose={() => setAutomatedActionPopoverOpen(false)}
                    />
                  )}
                  {customActionPopoverOpen && (
                    <AutomatedActionPopover
                      onClose={() => setAutomatedActionPopoverOpen(false)}
                    />
                  )} */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
