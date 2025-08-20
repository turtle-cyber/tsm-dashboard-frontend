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
import { LineChart } from "../charts/LineChart";
import { useCallback, useEffect, useState } from "react";
import { GET_ALERT_COUNT } from "@/endpoints/dashboardEndpoints";
import { http } from "@/data/config";

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
    dataKey: "critical",
    color: "#ef4444", // Tailwind red-500
    name: "Critical Alerts",
    strokeWidth: 2,
  },
  {
    dataKey: "high",
    color: "#f59e0b", // Tailwind amber-500
    name: "High Alerts",
    strokeWidth: 2,
  },
];

// Custom API Hooks
function useGetAlertCount() {
  const [cardData, setCardData] = useState<any>([]);
  const [cardsLoading, setCardsLoading] = useState(false);

  const fetchAlertCount = useCallback(async () => {
    setCardsLoading(true);
    try {
      const response = await http.get(GET_ALERT_COUNT);
      console.log("Response from GET_ALERT_COUNT:", response);
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

export function OverviewDashboard() {
  // Prepare classification data with percentages
  const classificationDataWithPercentages = classificationData.map((item) => ({
    ...item,
    percentage: item.value,
  }));

  // Prepare agents attention data with percentages
  const agentsDataWithPercentages = agentsAttentionData.map((item) => ({
    ...item,
    percentage: item.value,
  }));

  // Get the alert count data from the API
  const { cardData, cardsLoading } = useGetAlertCount();

  return (
    <div className="grid gap-4 lg:grid-cols-[60%_40%] items-stretch">
      {/*  */}
      <section className="grid gap-4 grid-rows-[auto_1fr]">
        {/* Row 1: four event cards */}
        <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
          {console.log("Card Data:", cardData)}
          {cardData.map((index) => (
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
          <CardContent className="pt-0">
            <div className="grid gap-4 md:grid-cols-2 mb-3">
              {/* Third Row - Malware KPI Cards */}
              <MalwareKPICard
                title="Fileless Malware Count"
                count={127}
                subtitle="Last 7 Days"
                icon={<FileIcon className="h-6 w-6 text-red-500" />}
              />
              <MalwareKPICard
                title="File-Based Malware Count"
                count={89}
                subtitle="Last 7 Days"
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Critical and High Alerts Created Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 h-full">
            <div className="h-[300px] md:h-[420px] lg:h-full w-full">
              <LineChart
                data={mockData}
                chartType="linear"
                lines={lineConfigs}
                xAxisKey="date"
                height={350}
                showGrid={true}
                showLegend={true}
                showTooltip={true}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Second Row - 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top High-Value Assets With Alerts */}
      </div>
    </div>
  );
}
