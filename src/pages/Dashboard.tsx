import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">DASHBOARDS</h1>
        </div>
      </div>
      
      <DashboardTabs>
        <OverviewDashboard />
      </DashboardTabs>
    </div>
  );
}