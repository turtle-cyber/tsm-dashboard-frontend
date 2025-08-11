import { useCallback, useEffect, useState } from "react";
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
  eventFields,
  eventHistogramData,
  type EventData,
} from "@/data/mockEventData";

import { PAGINATED_LOGS, GET_INDICES } from "../constants/eventSearchEndpoints";

import { http } from "../data/config";
import { toast } from "sonner";
import { SkeletonTableRows } from "@/lib/helpers";
import EventDetailsPanel from "@/components/ui/event-details-panel";

type DocRef = { id: string; indexName: string };

// Custom API hooks
function useGetIndices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIndices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await http.get(GET_INDICES);
      setData(res.data.indices || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndices();
  }, [fetchIndices]);

  return { data, loading, error, refetch: fetchIndices };
}

function useGetPaginatedLogs(indexName?: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await http.get(PAGINATED_LOGS, {
        params: { indexName },
      });
      setData(res.data.hits || []);
      toast.success("Logs fetched successfully");
    } catch (err) {
      toast.error("Failed to fetch logs for index: " + indexName);
      setError(err as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [indexName]);

  useEffect(() => {
    if (!indexName) return;
    fetchLogs();
  }, [indexName, fetchLogs]);

  return { data, loading, error, refetch: fetchLogs };
}

function truncate(s?: string, n = 60) {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

export default function EventSearch() {
  const [selectedIndex, setSelectedIndex] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocRef | null>(null);

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
            <div className="flex-1 overflow-auto py-2">
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
                  {logsLoading && !logsError && (
                    <SkeletonTableRows rows={10} cols={6} />
                  )}

                  {!logsLoading && logsError && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-sm text-red-400"
                      >
                        Failed to fetch logs
                      </TableCell>
                    </TableRow>
                  )}

                  {!logsLoading && !logsError && logsData.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-sm text-muted-foreground"
                      >
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}

                  {!logsLoading &&
                    !logsError &&
                    logsData.length > 0 &&
                    logsData.map((row: any) => {
                      const docId = row._id ?? row.id;
                      const indexName = row._index ?? selectedIndex; // selectedIndex from your Select

                      return (
                        <TableRow
                          key={row.id ?? row._id}
                          className="border-border hover:bg-muted/50 cursor-pointer"
                          onClick={() =>
                            setSelectedDoc({
                              id: String(docId),
                              indexName: String(indexName),
                            })
                          }
                        >
                          <TableCell className="text-xs">
                            {row.serial}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.id ?? row._id}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.time ?? row["@timestamp"]}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.agent ?? "-"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.level ?? "-"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {truncate(row.description, 80)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      {/* Event Details Panel */}
      {selectedDoc && (
        <>
          <EventDetailsPanel
            doc={selectedDoc}
            isOpen={!!selectedDoc}
            onClose={() => setSelectedDoc(null)}
          />
        </>
      )}
    </div>
  );
}
