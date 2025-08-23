import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MalwareKPICard } from "./Components/MalwareKPICard";

import { Copy, FileIcon, Monitor } from "lucide-react";
import EventCard from "./Components/EventCard";
import OverallMalwareCard from "./Components/OverallMalwareCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GET_ALERT_COUNT,
  GET_ALERT_TRENDS,
  GET_AGENTS,
  GET_TOP_ALERTS,
} from "@/endpoints/dashboardEndpoints";
import { http } from "@/lib/config";
import AlertsLineChart from "./Components/AlertsLineChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { DonutChart } from "../charts/DonutChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { FaWindows, FaLinux } from "react-icons/fa";
import { TruncText } from "@/lib/helpers";
import ConfidenceGauge from "./Components/ConfidenceGauge";
import MethodologyFlow from "./Components/FlowMethodology";

// Custom API Hooks
function useGetAlertCount() {
  const [cardData, setCardData] = useState<any>([]);
  const [cardsLoading, setCardsLoading] = useState(false);

  const fetchAlertCount = useCallback(async () => {
    setCardsLoading(true);
    try {
      const response = await http.get(GET_ALERT_COUNT);
      setCardData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching alert count:", error);
    } finally {
      setCardsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertCount();
  }, []);

  return { cardData, cardsLoading, refetch: fetchAlertCount };
}

function useGetAlertTrends(severity: string = "high") {
  const [trendsData, setTrendsData] = useState<any>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);

  const fetchAlertTrends = useCallback(async () => {
    setTrendsLoading(true);
    try {
      const response = await http.get(GET_ALERT_TRENDS, {
        params: { pattern: "wazuh-alerts*", severity: severity },
      });

      setTrendsData(response?.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch alert trends. Please try again later.");
      console.error("Error fetching alert trends:", error);
    } finally {
      setTrendsLoading(false);
    }
  }, [severity]);

  useEffect(() => {
    fetchAlertTrends();
  }, [severity]);

  return { trendsData, trendsLoading, refetch: fetchAlertTrends };
}

function useGetTopAlerts() {
  const [topAlertsData, setTopAlertsData] = useState<any>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const fetchTopAlerts = useCallback(async () => {
    setAlertsLoading(true);
    try {
      const response = await http.get(GET_TOP_ALERTS);
      setTopAlertsData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching top alerts:", error);
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopAlerts();
  }, []);

  return { topAlertsData, alertsLoading, refetch: fetchTopAlerts };
}

const useGetAgents = () => {
  const [agentsData, setAgentsData] = useState<any>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);

  const fetchAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const response = await http.get(GET_AGENTS);

      setAgentsData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching top agents:", error);
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, []);

  return { agentsData, agentsLoading, refetch: fetchAgents };
};

const UNRESOLVED_BY_AGENT: Record<string, number> = {
  "001": 266,
};

function StatusDot({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const color =
    s === "active"
      ? "bg-green-500"
      : s === "disconnected" || s === "inactive"
      ? "bg-red-500"
      : "bg-zinc-400";
  const label =
    s === "active"
      ? "Active"
      : s === "disconnected" || s === "inactive"
      ? "Inactive"
      : "Unknown";
  return (
    <div className="flex items-center justify-end gap-2">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${color}`}
        aria-hidden="true"
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function OSIcon({ os }: { os: string }) {
  const lower = (os || "").toLowerCase();
  const isWindows = lower.includes("win");
  const isLinux =
    lower.includes("linux") ||
    lower.includes("ubuntu") ||
    lower.includes("debian") ||
    lower.includes("centos") ||
    lower.includes("red hat") ||
    lower.includes("rhel") ||
    lower.includes("fedora");

  if (isWindows)
    return <FaWindows className="h-4 w-4 text-sky-400" aria-label="Windows" />;
  if (isLinux)
    return <FaLinux className="h-4 w-4 text-zinc-300" aria-label="Linux" />;
  return (
    <Monitor
      className="h-4 w-4 text-muted-foreground"
      aria-label="Unknown OS"
    />
  );
}

export function OverviewDashboard() {
  //Local States
  const [selectedSeverity, setSelectedSeverity] = useState("High");

  const severities = ["Critical", "High", "Medium", "Low"];

  // Get the alert count data from the API
  const { cardData, cardsLoading } = useGetAlertCount();
  const { trendsData, trendsLoading } = useGetAlertTrends(selectedSeverity);
  const { topAlertsData, alertsLoading } = useGetTopAlerts();
  const { agentsData, agentsLoading } = useGetAgents();

  const rows = useMemo(() => {
    // Map API agents to table rows and merge unresolved from static map
    const mapped = (agentsData || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      ip: a.ip,
      os: a.os_name,
      category: Array.isArray(a.group) && a.group.length ? a.group[0] : "—",
      status: a.status,
      unresolved: UNRESOLVED_BY_AGENT[a.id] ?? 0,
    }));
    // Sort by unresolved desc
    mapped.sort((a, b) => b.unresolved - a.unresolved);
    return mapped;
  }, [agentsData]);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[60%_40%] items-stretch">
        {/*  */}
        <section className="grid gap-4 grid-rows-[auto_1fr]">
          {/* Row 1: four event cards */}
          <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
            {cardData.map((index: any) => (
              <EventCard
                title={index?.key}
                count={index?.count}
                percentage={index?.percentage}
                variant={index?.key.toLowerCase() || "high"}
              />
            ))}
          </div>

          {/* Row 2: Malware Detection panel (fills remaining height on the left) */}
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Malware Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 mb-3">
                {/* Third Row - Malware KPI Cards */}
                <MalwareKPICard
                  title="Fileless Malware Count"
                  count={127}
                  subtitle="Blocks harmful files hidden in downloads, attachments, and scripts"
                  icon={<FileIcon className="h-6 w-6 text-red-500" />}
                />
                <MalwareKPICard
                  title="File-Based Malware Count"
                  count={89}
                  subtitle="Stops attacks that run directly in memory or systen processes."
                  icon={<Copy className="h-6 w-6 text-red-500" />}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <OverallMalwareCard />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* RIGHT: full height chart */}
        <section className="h-full">
          <Card className="h-full">
            <CardHeader className="pb-2 justify-between flex items-center">
              <CardTitle className="text-base">
                Alerts Created Over Last Week
              </CardTitle>
              {/* Severity Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-28 rounded-lg text-sm font-medium"
                  >
                    {selectedSeverity}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="center"
                  sideOffset={5}
                  className="animate-in fade-in-80 slide-in-from-top-2 duration-300"
                >
                  {severities.map((severity) => (
                    <DropdownMenuItem
                      key={severity}
                      onClick={() => setSelectedSeverity(severity)}
                    >
                      {severity}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="pt-4 h-full">
              <div className="h-[300px] md:h-[420px] lg:h-full w-full">
                <AlertsLineChart data={trendsData} />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <div className="grid gap-4 items-stretch lg:grid-cols-[33%_33%_33%] pt-2">
        <Card className="h-full">
          <CardHeader className="pb-2 justify-between flex items-center">
            <CardTitle className="text-base">Top 5 Alerts</CardTitle>
          </CardHeader>
          <CardContent className="">
            <DonutChart
              data={topAlertsData}
              innerRadius={50}
              outerRadius={80}
              chartHeight={200}
              legendPosition="right"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-base">
              Top High Value Targets With Unresolved Alerts
            </CardTitle>
          </CardHeader>

          <CardContent>
            <TooltipProvider delayDuration={150}>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60">
                    <TableHead className="w-[10%] text-xs">
                      Agent Name
                    </TableHead>
                    <TableHead className="w-[10%] text-xs">
                      Unresolved
                    </TableHead>
                    <TableHead className="w-[12%] text-xs">Category</TableHead>
                    <TableHead className="w-[15%] text-xs">Agent IP</TableHead>
                    <TableHead className="w-[10%] text-center text-xs">
                      OS
                    </TableHead>
                    <TableHead className="w-[13%] text-center text-xs">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="text-xs">
                  {rows.map((row: any) => (
                    <TableRow
                      key={row.id}
                      className="border-border/60 hover:bg-muted/30 transition-colors"
                    >
                      {/* Agent Name (truncate + tooltip) */}
                      <TableCell>
                        <TruncText value={row.name} maxWidth="max-w-[160px]" />
                      </TableCell>

                      {/* Unresolved (numeric, keep compact) */}
                      <TableCell className="tabular-nums">
                        {row.unresolved.toLocaleString()}
                      </TableCell>

                      {/* Category (truncate + tooltip in a badge) */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="px-1 py-0.5 rounded-md"
                        >
                          <TruncText
                            value={row.category}
                            maxWidth="max-w-[120px]"
                          />
                        </Badge>
                      </TableCell>

                      {/* Agent IP (truncate + tooltip, tabular) */}
                      <TableCell className="tabular-nums">
                        <TruncText value={row.ip} maxWidth="max-w-[140px]" />
                      </TableCell>

                      {/* OS (icon + tooltip already) */}
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted/20">
                              <OSIcon os={row.os} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {row.os || "Unknown"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Status (centered dot + label) */}
                      <TableCell className="text-center">
                        <StatusDot status={row.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-base">
              Confidence Score For Fileless Malware
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConfidenceGauge />
          </CardContent>
        </Card>

        {/* Kill chain card */}
        <Card className="col-span-full hover:bg-card/50 transition">
          <CardHeader className="pb-2 justify-between flex items-center">
            <CardTitle className="text-base">
              Fileless Malware Detection Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MethodologyFlow />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
