import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { MalwareKPICard } from "../Components/MalwareKPICard";

import { Copy, FileIcon, Monitor } from "lucide-react";
import EventCard from "../Components/EventCard";
import OverallMalwareCard from "../Components/OverallMalwareCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GET_ALERT_COUNT,
  GET_ALERT_TRENDS,
  GET_AGENTS,
  GET_TOP_ALERTS,
} from "@/features/dashboard/dashboardEndpoints";
import { http } from "@/lib/config";
import AlertsLineChart from "../Components/AlertsLineChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import { DonutChart } from "../../charts/DonutChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Badge } from "@/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { FaWindows, FaLinux, FaUbuntu } from "react-icons/fa";
import { TruncText } from "@/lib/helpers";
import ConfidenceGauge from "../Components/ConfidenceGauge";

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
      : s === "disconnected"
      ? "Disconnected"
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
  const isWindows = lower.includes("windows");
  const isUbuntu = lower.includes("ubuntu");
  const isLinux =
    lower.includes("linux") ||
    lower.includes("debian") ||
    lower.includes("centos") ||
    lower.includes("red hat") ||
    lower.includes("rhel") ||
    lower.includes("fedora");

  if (isWindows)
    return <FaWindows className="h-4 w-4 text-sky-400" aria-label="Windows" />;
  if (isUbuntu)
    return <FaUbuntu className="h-4 w-4 text-orange-400" aria-label="Ubuntu" />;
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

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[67%_33%] items-stretch">
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
          <CardContent className="overflow-x-auto">
            <DonutChart
              data={topAlertsData}
              innerRadius={70}
              outerRadius={100}
              chartHeight={250}
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
                  {agentsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : agentsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No agents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    agentsData.map((row: any) => (
                      <TableRow
                        key={row.id ?? row.name} // fallback key if id not present
                        className="border-border/60 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <TruncText
                            value={row.name}
                            maxWidth="max-w-[160px]"
                          />
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className="px-1 py-0.5 rounded-md"
                          >
                            <TruncText
                              value={row.group}
                              maxWidth="max-w-[120px]"
                            />
                          </Badge>
                        </TableCell>

                        <TableCell className="tabular-nums">
                          <TruncText value={row.ip} maxWidth="max-w-[140px]" />
                        </TableCell>

                        <TableCell className="text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted/20">
                                <OSIcon os={row.os_name} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              {row.os_name || "Unknown"}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>

                        <TableCell className="text-center">
                          <StatusDot status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
      </div>
      <div className="grid gap-4 lg:grid-cols-[60%_40%] items-stretch pt-2">
        <Card>Hi</Card>
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-base">
              Fileless Malware Detection Methodology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="w-[10%] text-xs">Campaign</TableHead>
                  <TableHead className="w-[15%] text-xs">
                    MITRE ATT&CK Tactic
                  </TableHead>
                  <TableHead className="w-[12%] text-xs">Agent IP</TableHead>
                  <TableHead className="w-[10%] text-center text-xs">
                    Malicious Confidence
                  </TableHead>
                  <TableHead className="w-[10%] text-xs">Description</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
