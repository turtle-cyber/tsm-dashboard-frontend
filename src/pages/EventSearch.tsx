import { useState } from "react";
import { Search, Filter, Save, Share2, Calendar, ChevronDown, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LineChart } from "@/components/charts/LineChart";
import { mockEvents, eventFields, eventHistogramData, type EventData } from "@/data/mockEventData";
import { cn } from "@/lib/utils";

const timeRangeOptions = [
  { label: "Last 4 hours", value: "4h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Custom", value: "custom" }
];

const productOptions = [
  { label: "XDR", value: "xdr" },
  { label: "Cloud", value: "cloud" },
  { label: "M365", value: "m365" },
  { label: "All Products", value: "all" }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-400 bg-red-400/10';
    case 'high': return 'text-orange-400 bg-orange-400/10';
    case 'medium': return 'text-yellow-400 bg-yellow-400/10';
    case 'low': return 'text-blue-400 bg-blue-400/10';
    case 'info': return 'text-cyan-400 bg-cyan-400/10';
    default: return 'text-muted-foreground bg-muted/10';
  }
};

const EventDetailsPanel = ({ event, isOpen, onClose }: { event: EventData; isOpen: boolean; onClose: () => void }) => (
  <Sheet open={isOpen} onOpenChange={onClose}>
    <SheetContent className="w-[600px] sm:max-w-[600px] bg-card border-border">
      <SheetHeader>
        <SheetTitle className="text-foreground flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Event Details
        </SheetTitle>
      </SheetHeader>
      
      <div className="mt-6 space-y-6">
        {/* Event Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{event.vendor.logo}</span>
            <span className="font-semibold text-lg">{event.vendor.name}</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{event.eventType}</h2>
          <Badge className={cn("text-xs", getSeverityColor(event.severity))}>
            {event.severity.toUpperCase()}
          </Badge>
        </div>

        <Separator />

        {/* Event Details */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Event Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event Time:</span>
                <span className="text-foreground">{event.eventTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event Type:</span>
                <span className="text-foreground">{event.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span className="text-foreground text-xs">{event.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination:</span>
                <span className="text-foreground text-xs">{event.destination}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actor Details */}
          {event.details.actor && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Actor</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User Name:</span>
                  <span className="text-foreground">{event.details.actor.user?.name || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Device Details */}
          {event.details.device && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Device</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hostname:</span>
                  <span className="text-foreground">{event.details.device.hostname || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP Address:</span>
                  <span className="text-foreground">{event.details.device.ip || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Data Source */}
          {event.details.dataSource && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Data Source</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span className="text-foreground">{event.details.dataSource.vendor || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default function EventSearch() {
  const [searchQuery, setSearchQuery] = useState("dataSource.vendor='Microsoft'");
  const [selectedProduct, setSelectedProduct] = useState("xdr");
  const [selectedTimeRange, setSelectedTimeRange] = useState("4h");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const histogramConfig = [
    {
      dataKey: "count",
      color: "hsl(var(--primary))",
      name: "Events"
    }
  ];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">EVENT SEARCH</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <span className="mr-1">PowerQuery</span>
                <Badge variant="secondary" className="text-xs px-1">ON</Badge>
              </Button>
            </div>
          </div>

          {/* Search Controls */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="pl-10"
                />
              </div>

              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="bg-primary hover:bg-primary/90">
                Search
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Start
              </Button>
              <Button variant="outline" size="sm">
                End
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Save Search</DropdownMenuItem>
                  <DropdownMenuItem>Save as Alert</DropdownMenuItem>
                  <DropdownMenuItem>Export Results</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Share Link</DropdownMenuItem>
                  <DropdownMenuItem>Copy Query</DropdownMenuItem>
                  <DropdownMenuItem>Export CSV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 flex">
          {/* Fields Panel */}
          <div className="w-80 border-r border-border bg-card/30">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Products</h3>
                <span className="text-xs text-muted-foreground">All</span>
              </div>
              <div className="mb-6">
                <div className="text-xs text-muted-foreground mb-2">23</div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Fields</h3>
              </div>
              <Input placeholder="Filter fields" className="mb-4 text-xs" />
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {eventFields.map((field) => (
                    <div key={field.name} className="flex items-center justify-between py-1 px-2 hover:bg-muted/50 rounded text-xs cursor-pointer">
                      <span className="text-foreground truncate flex-1">{field.name}</span>
                      <span className="text-muted-foreground ml-2">{field.count}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Results Area */}
          <div className="flex-1 flex flex-col">
            {/* Results Summary */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    <span className="font-bold">5,779,010</span> matching events
                  </span>
                  <span className="text-xs text-muted-foreground">5 minutes/bar</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Expand Graph
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  7:58 - 11:58 am (UTC-4)
                </div>
              </div>

              {/* Event Timeline Chart */}
              <Card>
                <CardContent className="p-4">
                  <LineChart
                    data={eventHistogramData}
                    lines={histogramConfig}
                    xAxisKey="time"
                    height={120}
                    showLegend={false}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Results Table */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Event Time</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Event type</TableHead>
                    <TableHead>unmapped.eventType</TableHead>
                    <TableHead>Event Source</TableHead>
                    <TableHead>Event Target</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvents.map((event) => (
                    <TableRow 
                      key={event.id} 
                      className="border-border hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell className="text-xs">
                        {event.eventTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{event.vendor.logo}</span>
                          <span className="text-xs">{event.vendor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-xs">{event.eventType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {event.unmappedEventType}
                      </TableCell>
                      <TableCell className="text-xs">
                        {event.source.length > 30 ? `${event.source.substring(0, 30)}...` : event.source}
                      </TableCell>
                      <TableCell className="text-xs">
                        {event.destination.length > 30 ? `${event.destination.substring(0, 30)}...` : event.destination}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Panel */}
      {selectedEvent && (
        <EventDetailsPanel
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}