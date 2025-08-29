import { useState } from "react";
import { X, Brain, TrendingUp, Play } from "lucide-react";
import { alertDetails } from "@/data/mockData";
import { Button } from "@/ui/button";
import { SeverityBadge } from "@/ui/severity-badge";
import { Badge } from "@/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

interface AlertDetailsPanelProps {
  alertId: string;
  onClose: () => void;
}

export function AlertDetailsPanel({
  alertId,
  onClose,
}: AlertDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[30%] bg-background border-l border-border shadow-2xl overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground">
                {alertDetails.title}
              </h2>
              <SeverityBadge severity={alertDetails.severity}>
                {alertDetails.severity.charAt(0).toUpperCase() +
                  alertDetails.severity.slice(1)}
              </SeverityBadge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Badge variant="outline">{alertDetails.status}</Badge>
              <span>{alertDetails.timestamp}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsContent value="overview" className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {alertDetails.description}
                </p>
              </div>

              {/* Start Investigation Button */}
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Investigation
              </Button>
            </TabsContent>

            <TabsContent value="indicators" className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">
                Indicators of Compromise
              </h3>
              <div className="space-y-4">
                {alertDetails.indicators.map((indicator, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{indicator.type}</Badge>
                      </div>
                      <div className="font-mono text-sm text-primary mb-2">
                        {indicator.value}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {indicator.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mitigation" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Recommended Mitigation Steps
                </h3>
                <div className="space-y-3">
                  {alertDetails.mitigationSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {["notes", "history", "graph", "raw-data"].map((tab) => (
              <TabsContent key={tab} value={tab} className="p-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      {tab.charAt(0).toUpperCase() +
                        tab.slice(1).replace("-", " ")}{" "}
                      data will be displayed here.
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
