import { useState } from "react";
import { AlertsDataGrid } from "@/components/alerts/AlertsDataGrid";
import { AlertDetailsPanel } from "@/components/alerts/AlertDetailsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link2, Maximize2 } from "lucide-react";

export default function Alerts() {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const handleAlertSelect = (alertId: string) => {
    setSelectedAlertId(alertId);
  };

  const handleCloseDetails = () => {
    setSelectedAlertId(null);
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`transition-all duration-300 ${selectedAlertId ? 'flex-1 mr-[600px]' : 'w-full'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-foreground">ALERTS</h1>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Alert Tabs */}
          <Tabs defaultValue="unified-alerts" className="w-full">
            <TabsList className="grid w-fit grid-cols-2 h-10 bg-muted/30 border border-border rounded-lg">
              <TabsTrigger
                value="unified-alerts"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium transition-all duration-200"
              >
                Unified Alerts
              </TabsTrigger>
              <TabsTrigger
                value="watchlist"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-sm font-medium transition-all duration-200"
              >
                Watchlist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unified-alerts" className="mt-6">
              <AlertsDataGrid 
                onAlertSelect={handleAlertSelect}
                selectedAlertId={selectedAlertId || undefined}
              />
            </TabsContent>

            <TabsContent value="watchlist" className="mt-6">
              <div className="flex items-center justify-center h-64 bg-card border border-border rounded-lg">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Watchlist
                  </h3>
                  <p className="text-muted-foreground">
                    Your watched alerts will appear here.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Alert Details Panel */}
      {selectedAlertId && (
        <AlertDetailsPanel
          alertId={selectedAlertId}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}