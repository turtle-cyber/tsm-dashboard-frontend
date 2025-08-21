import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MalwareKPICard } from "./Components/MalwareKPICard";

import {
  Crown,
  Copy,
  AlertTriangle,
  AlertCircle,
  Users,
  FileIcon,
} from "lucide-react";
import { classificationData, agentsAttentionData } from "@/data/mockData";
import EventCard from "./Components/EventCard";
import OverallMalwareCard from "./Components/OverallMalwareCard";
import { useCallback, useEffect, useState } from "react";
import {
  GET_ALERT_COUNT,
  GET_ALERT_TRENDS,
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
      console.log("Top Alerts Data:", topAlertsData);
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

const donutData = [
  { label: "Apples", value: 470 },
  { label: "Oranges", value: 300 },
  { label: "Bananas", value: 300 },
  { label: "Grapes", value: 200 },
  { label: "Pears", value: 100 },
];

// Calculate percentages dynamically
const total = donutData.reduce((acc, item) => acc + item.value, 0);
const donutDataWithPercentage = donutData.map((item) => ({
  ...item,
  percentage: (item.value / total) * 100,
}));

export default donutDataWithPercentage;

export function OverviewDashboard() {
  //Local States
  const [selectedSeverity, setSelectedSeverity] = useState("High");

  const severities = ["Critical", "High", "Medium", "Low"];

  // Get the alert count data from the API
  const { cardData, cardsLoading } = useGetAlertCount();
  const { trendsData, trendsLoading } = useGetAlertTrends(selectedSeverity);
  const { topAlertsData, alertsLoading } = useGetTopAlerts();

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
        <Card className="" />
        <Card className="" />
      </div>
    </>
  );
}
