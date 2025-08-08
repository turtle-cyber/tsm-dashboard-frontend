import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Save,
  Share2,
  Calendar,
  ChevronDown,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LineChart } from "@/components/charts/LineChart";
import {
  mockEvents,
  eventFields,
  eventHistogramData,
  type EventData,
} from "@/data/mockEventData";
import { cn } from "@/lib/utils";

import {
  useGetIndices,
  useGetPaginatedLogs,
} from "@/hooks/eventSearch.asyncActions";

const timeRangeOptions = [
  { label: "Last 4 hours", value: "4h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Custom", value: "custom" },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "text-red-400 bg-red-400/10";
    case "high":
      return "text-orange-400 bg-orange-400/10";
    case "medium":
      return "text-yellow-400 bg-yellow-400/10";
    case "low":
      return "text-blue-400 bg-blue-400/10";
    case "info":
      return "text-cyan-400 bg-cyan-400/10";
    default:
      return "text-muted-foreground bg-muted/10";
  }
};

const EventDetailsPanel = ({
  event,
  isOpen,
  onClose,
}: {
  event: EventData;
  isOpen: boolean;
  onClose: () => void;
}) => (
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
          <h2 className="text-xl font-bold text-foreground">
            {event.eventType}
          </h2>
          <Badge className={cn("text-xs", getSeverityColor(event.severity))}>
            {event.severity.toUpperCase()}
          </Badge>
        </div>

        <Separator />

        {/* Event Details */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Event Information
            </h3>
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
                <span className="text-foreground text-xs">
                  {event.destination}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actor Details */}
          {event.details.actor && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Actor
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User Name:</span>
                  <span className="text-foreground">
                    {event.details.actor.user?.name || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Device Details */}
          {event.details.device && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Device
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hostname:</span>
                  <span className="text-foreground">
                    {event.details.device.hostname || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP Address:</span>
                  <span className="text-foreground">
                    {event.details.device.ip || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Data Source */}
          {event.details.dataSource && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Data Source
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor:</span>
                  <span className="text-foreground">
                    {event.details.dataSource.vendor || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

function truncate(s?: string, n = 60) {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

export default function EventSearch() {
  const [selectedIndex, setSelectedIndex] = useState<string>("");
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: indicesList,
    loading: indicesLoading,
    error: indicesError,
  } = useGetIndices();

  useEffect(() => {
    if (indicesList.length > 0 && !selectedIndex) {
      setSelectedIndex(indicesList[0].index);
    }
  }, [indicesList, selectedIndex]);

  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
  } = useGetPaginatedLogs(selectedIndex || undefined);

  const histogramConfig = [
    {
      dataKey: "count",
      color: "hsl(var(--primary))",
      name: "Events",
    },
  ];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="py-2 px-6 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">EVENT SEARCH</h1>
          </div>

          {/* Search Controls */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select value={selectedIndex} onValueChange={setSelectedIndex}>
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {indicesList.map((e) => (
                    <SelectItem key={e.uuid} value={e.index}>
                      {e.index}
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

              {/* <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
              >
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
              </Select> */}

              <Button className="bg-primary hover:bg-primary/90">Search</Button>
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
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Fields
                </h3>
              </div>
              <Input placeholder="Filter fields" className="mb-4 text-xs" />

              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {eventFields.map((field) => (
                    <div
                      key={field.name}
                      className="flex items-center justify-between py-2 px-2 hover:bg-muted/80 rounded text-xs cursor-pointer"
                    >
                      <span className="text-foreground truncate flex-1">
                        {field.name}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {field.count}
                      </span>
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
                  <span className="text-xs text-muted-foreground">
                    5 minutes/bar
                  </span>
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
                    <TableHead>Serial No.</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Description</TableHead>
                    {/* <TableHead>Event</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-border hover:bg-muted/50 cursor-pointer"
                      // onClick={() => setSelectedEvent(row)} // if you use a details pane
                    >
                      <TableCell className="text-xs">{row.serial}</TableCell>
                      <TableCell className="text-xs">{row.id}</TableCell>
                      <TableCell className="text-xs">{row.time}</TableCell>
                      <TableCell className="text-xs">
                        {row.agent ?? "-"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {row.level ?? "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {truncate(row.description, 80)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {truncate(row.event, 80)}
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
      {/* {selectedEvent && (
        <EventDetailsPanel
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )} */}
    </div>
  );
}
