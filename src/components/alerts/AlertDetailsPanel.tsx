import { useState } from "react";
import { X, Brain, TrendingUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { alertDetails } from "@/data/mockData";

interface AlertDetailsPanelProps {
  alertId: string;
  onClose: () => void;
}

export function AlertDetailsPanel({ alertId, onClose }: AlertDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[600px] bg-background border-l border-border shadow-2xl overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground">
                {alertDetails.title}
              </h2>
              <SeverityBadge severity={alertDetails.severity}>
                {alertDetails.severity.charAt(0).toUpperCase() + alertDetails.severity.slice(1)}
              </SeverityBadge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Badge variant="outline">
                {alertDetails.status}
              </Badge>
              <span>{alertDetails.timestamp}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 p-4 border-b border-border bg-muted/20">
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
            Actions
          </Button>
          <Button variant="outline" size="sm">
            Mitigate
          </Button>
          <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20">
            <Play className="h-4 w-4 mr-2" />
            Automate
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-8 h-12 bg-muted/30 border-b border-border rounded-none">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="indicators">Indicators (1)</TabsTrigger>
              <TabsTrigger value="mitigation">Mitigation (0)</TabsTrigger>
              <TabsTrigger value="notes">Notes (0)</TabsTrigger>
              <TabsTrigger value="history">History (0)</TabsTrigger>
              <TabsTrigger value="graph">Graph</TabsTrigger>
              <TabsTrigger value="raw-data">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6 space-y-6">
              {/* Alert Status */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Alert Status</div>
                  <Badge variant="secondary" className="w-full justify-center">
                    New
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Assigned To</div>
                  <Badge variant="outline" className="w-full justify-center">
                    Unassigned
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Analyst Verdict</div>
                  <Badge variant="outline" className="w-full justify-center text-primary">
                    Undefined
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Purple AI Section */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                      <Brain className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span>Purple AI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Community Verdict (True Positive, not Benign)
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        &gt;{alertDetails.aiVerdict.confidence}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        AI Similarity Analysis
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {alertDetails.similarityScore}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {alertDetails.description}
                </p>
              </div>

              {/* Start Investigation Button */}
              <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Investigation
              </Button>
            </TabsContent>

            <TabsContent value="indicators" className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Indicators of Compromise</h3>
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
                <h3 className="text-lg font-semibold">Recommended Mitigation Steps</h3>
                <div className="space-y-3">
                  {alertDetails.mitigationSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
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
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')} data will be displayed here.
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