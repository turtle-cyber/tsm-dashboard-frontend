import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Filter,
  Save,
  Share2,
  ChevronDown,
  Minus,
  Plus,
  Sidebar,
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

import { LineChart } from "@/components/charts/LineChart";
import {
  eventFields,
  eventHistogramData,
  type EventData,
} from "@/data/mockEventData";

import {
  PAGINATED_LOGS,
  GET_INDICES,
  GET_FIELD_BY_PATTERN,
  GET_EVENT_HISTOGRAM,
} from "../constants/eventSearchEndpoints";

import { http } from "../data/config";
import { toast } from "sonner";
import { SkeletonTableRows } from "@/lib/helpers";
import EventDetailsPanel from "@/components/ui/event-details-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type DocRef = { id: string; indexName: string };

// Custom API hooks
function useGetIndices() {
  const [indicesList, setIndicesList] = useState([]);
  const [indicesListLoading, setIndicesListLoading] = useState(true);
  const [indicesListError, setIndicesListError] = useState(null);

  const fetchIndices = useCallback(async () => {
    setIndicesListLoading(true);
    setIndicesListError(null);
    try {
      const res = await http.get(GET_INDICES, { params: { as: "patterns" } });

      setIndicesList(res.data.patterns || []);
    } catch (err) {
      setIndicesListError(err);
    } finally {
      setIndicesListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndices();
  }, [fetchIndices]);

  return {
    indicesList,
    indicesListLoading,
    indicesListError,
    refetch: fetchIndices,
  };
}

function useGetPaginatedLogs(indexName?: string) {
  const [paginatedLogsData, setPaginatedLogsData] = useState([]);
  const [paginatedLogsLoading, setPaginatedLogsLoading] = useState(false);
  const [paginatedLogsError, setPaginatedLogsError] = useState<Error | null>(
    null
  );

  const fetchLogs = useCallback(async () => {
    setPaginatedLogsLoading(true);
    setPaginatedLogsError(null);
    try {
      const res = await http.get(PAGINATED_LOGS, {
        params: { indexName },
      });
      setPaginatedLogsData(res.data.hits || []);
      toast.success("Logs fetched successfully");
    } catch (err) {
      toast.error("Failed to fetch logs for index: " + indexName);
      setPaginatedLogsError(err as Error);
      setPaginatedLogsData([]);
    } finally {
      setPaginatedLogsLoading(false);
    }
  }, [indexName]);

  useEffect(() => {
    if (!indexName) return;
    fetchLogs();
  }, [indexName, fetchLogs]);

  return {
    paginatedLogsData,
    paginatedLogsLoading,
    paginatedLogsError,
    refetch: fetchLogs,
  };
}

function useGetFieldsList(patternName?: string) {
  const [fieldsListData, setFieldsListData] = useState([]);
  const [fieldsListLoading, setFieldsListLoading] = useState(null);
  const [fieldsListError, setFieldsListError] = useState(null);

  const fetchFieldsList = useCallback(async () => {
    setFieldsListLoading(true);
    setFieldsListError(null);
    setFieldsListData([]);
    try {
      const res = await http.get(GET_FIELD_BY_PATTERN, {
        params: { pattern: patternName },
      });
      setFieldsListData(res.data.fields);
    } catch (err) {
      setFieldsListError(err);
      setFieldsListData([]);
    } finally {
      setFieldsListLoading(false);
    }
  }, [patternName]);

  useEffect(() => {
    if (patternName) fetchFieldsList();
  }, [fetchFieldsList]);

  return {
    fieldsListData,
    fieldsListLoading,
    fieldsListError,
    refetch: fetchFieldsList,
  };
}

function useGetEventHistogram(patternName?: string) {
  const [histogramData, setHistogramData] = useState([]);
  const [histogramLoading, setHistogramLoading] = useState(false);
  const [histogramError, setHistogramError] = useState(false);

  const fetchHistogram = useCallback(async () => {
    setHistogramLoading(true);
    setHistogramError(null);
    setHistogramData([]);
    try {
      const res = await http.get(GET_EVENT_HISTOGRAM, {
        params: { pattern: patternName },
      });
      setHistogramData(res.data?.data);
    } catch (err) {
      setHistogramError(err);
      setHistogramData([]);
    } finally {
      setHistogramLoading(false);
    }
  }, [patternName]);

  useEffect(() => {
    if (patternName) fetchHistogram();
  }, [fetchHistogram]);

  return {
    histogramData,
    histogramLoading,
    histogramError,
    refetch: fetchHistogram,
  };
}

function truncate(s?: string, n = 60) {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

export default function EventSearch() {
  const [selectedPattern, setSelectedPattern] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocRef | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>(["_source"]);
  const [fieldsOpen, setFieldsOpen] = useState(true);

  const {
    indicesList: indicesList,
    indicesListLoading: indicesLoading,
    indicesListError: indicesError,
  } = useGetIndices();

  useEffect(() => {
    if (indicesList.length > 0 && !selectedPattern) {
      setSelectedPattern(indicesList[0].pattern);
    }
  }, [indicesList, selectedPattern]);

  const {
    paginatedLogsData: logsData,
    paginatedLogsLoading: logsLoading,
    paginatedLogsError: logsError,
  } = useGetPaginatedLogs(selectedPattern || undefined);

  const {
    fieldsListData: fieldsData,
    fieldsListLoading: fieldsLoading,
    fieldsListError: fieldsError,
  } = useGetFieldsList(selectedPattern || undefined);

  const {
    histogramData: rawHistogramData,
    histogramLoading: histogramLoading,
    histogramError: histogramError,
  } = useGetEventHistogram(selectedPattern || undefined);

  //Helper functions for Fields Panel
  const addField = useCallback((value: string) => {
    setSelectedFields((prev) => {
      if (value === "_source") return ["_source"]; // exclusive
      const next = prev.filter((v) => v !== "_source"); // drop _source if any other selected
      return next.includes(value) ? next : [...next, value];
    });
  }, []);

  const removeField = useCallback((value: string) => {
    setSelectedFields((prev) => {
      const next = prev.filter((v) => v !== value);
      // if nothing left, default back to _source
      return next.length ? next : ["_source"];
    });
  }, []);

  const hasNonSource = selectedFields.some((v) => v !== "_source");

  const selectedEntries = (fieldsData || []).filter((f: any) =>
    selectedFields.includes(f.value ?? f.id)
  );

  const availableEntries = (fieldsData || []).filter(
    (f: any) => !selectedFields.includes(f.value ?? f.id)
  );

  // truncate helper with tooltip
  const FieldLabel: React.FC<{ text: string }> = ({ text }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-foreground truncate flex-1">{text}</span>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs break-words">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // label like "8:00 AM" in IST (match your mock data style)
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });

  const chartHistogramData = rawHistogramData.map((d: any) => ({
    time: timeFmt.format(new Date(d.key)), // or use d.time if your API already returns ISO
    count: d.count ?? 0,
  }));

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
              <Select
                value={selectedPattern}
                onValueChange={setSelectedPattern}
              >
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {indicesList.map((e) => (
                    <SelectItem key={e.id ?? e.pattern} value={e.pattern}>
                      {e.pattern}
                      {e.indexCount != null ? ` (${e.indexCount})` : ""}
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
          <div
            className={`border-r border-border bg-card/30 flex-none overflow-hidden transition-[width] duration-200
    ${fieldsOpen ? "w-[20rem]" : "w-16"}`}
            aria-expanded={fieldsOpen}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 p-1">
                {fieldsOpen ? (
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Fields
                  </h3>
                ) : (
                  <span className="sr-only">Fields</span>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setFieldsOpen((v) => !v)}
                  aria-label={
                    fieldsOpen ? "Collapse fields panel" : "Expand fields panel"
                  }
                  title={fieldsOpen ? "Collapse" : "Expand"}
                >
                  <Sidebar className="w-4 h-4" />
                </Button>
              </div>

              {fieldsOpen && (
                <>
                  <Input placeholder="Search fields" className="mb-4 text-xs" />

                  <ScrollArea className="h-[600px] border border-border rounded-md">
                    <div className="p-2">
                      <Accordion
                        type="multiple"
                        defaultValue={["selected", "available"]}
                        className="w-full"
                      >
                        {/* Selected fields */}
                        <AccordionItem
                          value="selected"
                          className="border-b border-border"
                        >
                          <AccordionTrigger className="text-xs">
                            Selected fields ({selectedEntries.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-1">
                              {selectedEntries.length === 0 && (
                                <div className="text-xs text-muted-foreground py-2">
                                  No fields selected
                                </div>
                              )}
                              {selectedEntries.map((field: any) => {
                                const value = field.value ?? field.id;
                                const isSource = value === "_source";
                                const disabled = isSource && hasNonSource; // gray out _source if others selected

                                return (
                                  <div
                                    key={`sel-${value}`}
                                    className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs hover:bg-muted/70 ${
                                      disabled
                                        ? "opacity-50 pointer-events-none"
                                        : ""
                                    }`}
                                  >
                                    <FieldLabel text={value} />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 shrink-0"
                                      onClick={() => removeField(value)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Available fields */}
                        <AccordionItem value="available">
                          <AccordionTrigger className="text-xs">
                            Available fields ({availableEntries.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-1">
                              {availableEntries.map((field: any) => {
                                const value = field.value ?? field.id;
                                const isSource = value === "_source";
                                const disabled = isSource && hasNonSource; // _source disabled if others selected

                                return (
                                  <div
                                    key={`avail-${value}`}
                                    className={`flex items-center gap-2 py-1 px-2 rounded-md text-xs hover:bg-muted/70 ${
                                      disabled
                                        ? "opacity-50 pointer-events-none"
                                        : "cursor-pointer"
                                    }`}
                                  >
                                    <FieldLabel text={value} />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 shrink-0"
                                      onClick={() => addField(value)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </ScrollArea>
                </>
              )}
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
                    data={chartHistogramData}
                    lines={histogramConfig}
                    xAxisKey="time"
                    height={150}
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
                    <TableHead>Index</TableHead>
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
                      const indexName = row._index ?? selectedPattern; // selectedPattern from your Select

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
                            {row.index ?? row._index}
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
