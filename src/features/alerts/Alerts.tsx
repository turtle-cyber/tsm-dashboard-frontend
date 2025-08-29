import { useState } from "react";
import { AlertsDataGrid } from "@/features/alerts/Components/AlertsDataGrid";
import { AlertDetailsPanel } from "@/features/alerts/Components/AlertDetailsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Button } from "@/ui/button";
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
      <div
        className={`transition-all duration-300 ${
          selectedAlertId ? "flex-1 mr-[550px]" : "w-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-foreground">ALERTS</h1>
            </div>
          </div>

          {/* Alert Tabs */}
          <Tabs defaultValue="unified-alerts" className="w-full">
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
      {/* {selectedAlertId && (
        <AlertDetailsPanel
          alertId={selectedAlertId}
          onClose={handleCloseDetails}
        />
      )} */}
    </div>
  );
}
