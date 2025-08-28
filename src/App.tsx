import { Toaster } from "@/ui/toaster";
import { Toaster as Sonner } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";
import Dashboard from "./features/dashboard/DashboardPage";
import Alerts from "./features/alerts/Alerts";
import EventSearch from "./features/event-search/EventSearch";
import Inventory from "./features/inventory/Inventory";
import Threats from "./features/threats/Threats";
import ThreatsList from "./features/threats/Components/ThreatsList";
import ThreatDetails from "./features/threats/Components/ThreatDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/event-search" element={<EventSearch />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/threats" element={<ThreatsList />} />
            <Route path="/threats/:id" element={<ThreatDetails />} />
            {/* Placeholder routes for navigation items */}
            <Route
              path="/purple-ai"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Purple AI</h1>
                  <p className="text-muted-foreground">
                    Purple AI features coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="/exposures"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Exposures</h1>
                  <p className="text-muted-foreground">
                    Exposure management coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="/compliance"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Compliance</h1>
                  <p className="text-muted-foreground">
                    Compliance dashboard coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="/graph-explorer"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Graph Explorer</h1>
                  <p className="text-muted-foreground">
                    Graph exploration tools coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="/activities"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Activities</h1>
                  <p className="text-muted-foreground">
                    Activity monitoring coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="/hyperautomation"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Hyperautomation</h1>
                  <p className="text-muted-foreground">
                    Automation tools coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="/remoteops"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">RemoteOps</h1>
                  <p className="text-muted-foreground">
                    Remote operations coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="/detections"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Detections</h1>
                  <p className="text-muted-foreground">
                    Detection rules coming soon...
                  </p>
                </div>
              }
            />
            <Route
              path="/agent-management"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Agent Management</h1>
                  <p className="text-muted-foreground">
                    Agent management coming soon...
                  </p>
                </div>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
