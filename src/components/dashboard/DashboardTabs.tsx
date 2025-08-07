import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
  children: React.ReactNode;
}

const dashboardTabs = [
  { id: "overview", label: "Overview" },
  { id: "endpoints", label: "Endpoints" },
  { id: "health", label: "Health" },
  { id: "identity", label: "Identity" },
  { id: "vulnerability", label: "Vulnerability Management" },
  { id: "usage", label: "Usage Metering" },
  { id: "watchtower", label: "WatchTower" },
  { id: "cloud-native", label: "Cloud Native Security" },
  { id: "data-lake", label: "Data Lake" },
];

export function DashboardTabs({ children }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-9 h-12 bg-muted/30 border border-border rounded-lg p-1">
        {dashboardTabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium transition-all duration-200"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        {children}
      </TabsContent>
      
      {dashboardTabs.slice(1).map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          <div className="flex items-center justify-center h-64 bg-card border border-border rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {tab.label}
              </h3>
              <p className="text-muted-foreground">
                This dashboard tab is under development.
              </p>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}