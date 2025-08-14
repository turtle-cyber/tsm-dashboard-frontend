import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Save,
  Share2,
  ChevronDown,
  Minus,
  Plus,
  Sidebar,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
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
  PAGINATED_LOGS,
  GET_INDICES,
  GET_FIELD_BY_PATTERN,
  GET_EVENT_HISTOGRAM,
} from "../constants/eventSearchEndpoints";

import { http } from "../data/config";
import { toast } from "sonner";
import {
  SkeletonTableRows,
  resolveNowRelativeToISO,
  type CanonicalRange,
} from "@/lib/helpers";
import EventDetailsPanel from "@/components/ui/event-details-panel";
import DateTimeFilter from "@/components/DateTimeFilter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

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

function useGetPaginatedLogs(
  indexName?: string,
  page = 1,
  size = 50,
  startTime?: string,
  endTime?: string
) {
  const [paginatedLogsData, setPaginatedLogsData] = useState({
    hits: [] as any[],
    page: 1,
    totalPages: 1,
    total: 0,
    hasPrev: false,
    hasNext: false,
    count: 0,
    startTime: "", // <—
    endTime: "",
  });
  const [paginatedLogsLoading, setPaginatedLogsLoading] = useState(false);
  const [paginatedLogsError, setPaginatedLogsError] = useState<Error | null>(
    null
  );

  const fetchLogs = useCallback(async () => {
    setPaginatedLogsLoading(true);
    setPaginatedLogsError(null);
    try {
      const res = await http.get(PAGINATED_LOGS, {
        params: { indexName, page, size, startTime, endTime },
      });
      setPaginatedLogsData(
        res.data ?? {
          hits: [],
          page: 1,
          totalPages: 1,
          total: 0,
          hasPrev: false,
          hasNext: false,
          count: 0,
          startTime: "", // <= include these in the fallback too
          endTime: "",
        }
      );
      toast.success("Logs fetched successfully");
    } catch (err) {
      toast.error("Failed to fetch logs for index: " + indexName);
      setPaginatedLogsError(err as Error);
      setPaginatedLogsData((d) => ({ ...d, hits: [], count: 0 }));
    } finally {
      setPaginatedLogsLoading(false);
    }
  }, [indexName, page, size, startTime, endTime]);

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

function useGetEventHistogram(
  patternName?: string,
  startTime?: string,
  endTime?: string
) {
  const [histogramData, setHistogramData] = useState([]);
  const [histogramLoading, setHistogramLoading] = useState(false);
  const [histogramError, setHistogramError] = useState(false);

  const fetchHistogram = useCallback(async () => {
    setHistogramLoading(true);
    setHistogramError(null);
    setHistogramData([]);
    try {
      const res = await http.get(GET_EVENT_HISTOGRAM, {
        params: { pattern: patternName, startTime, endTime },
      });
      setHistogramData(res.data?.data);
    } catch (err) {
      setHistogramError(err);
      setHistogramData([]);
    } finally {
      setHistogramLoading(false);
    }
  }, [patternName, startTime, endTime]);

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pageInput, setPageInput] = useState("1");
  const [logsData, setLogsData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [timeRange, setTimeRange] = useState<CanonicalRange>({
    mode: "relative",
    from: "now-24h",
    to: "now",
  });
  // labels from backend (human-readable strings)
  const [startLabel, setStartLabel] = useState("");
  const [endLabel, setEndLabel] = useState("");
  // Freeze the "now" used for resolving relative ranges
  const [anchorNow, setAnchorNow] = useState<number | null>(null);

  const { startISO, endISO } = useMemo(() => {
    const anchor = anchorNow ? new Date(anchorNow) : new Date();
    const toISO = (s: string) =>
      timeRange.mode === "relative" ? resolveNowRelativeToISO(s, anchor) : s;

    return {
      startISO: toISO(timeRange.from),
      endISO: toISO(timeRange.to),
    };
  }, [timeRange, anchorNow]);

  //Fetch Indiceslist and refetch when pattern changes
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

  //Fetch Paginated Logs and refetch when selected pattern changes
  const {
    paginatedLogsData: paginated,
    paginatedLogsLoading: logsLoading,
    paginatedLogsError: logsError,
  } = useGetPaginatedLogs(
    selectedPattern || undefined,
    page,
    pageSize,
    startISO,
    endISO
  );

  useEffect(() => {
    setLogsData(paginated.hits);
    setTotalResults(paginated.total);
  }, [paginated]);

  useEffect(() => {
    setPage(1);
    setPageInput("1");
  }, [selectedPattern, timeRange.from, timeRange.to, timeRange.mode]);

  //Fetch All Possible Fields For Each Pattern
  const {
    fieldsListData: fieldsData,
    fieldsListLoading: fieldsLoading,
    fieldsListError: fieldsError,
  } = useGetFieldsList(selectedPattern || undefined);

  //Fetch All Event Count for Histogram For Each Pattern
  const {
    histogramData: rawHistogramData,
    histogramLoading: histogramLoading,
    histogramError: histogramError,
  } = useGetEventHistogram(selectedPattern || undefined, startISO, endISO);

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
        <span
          className="block flex-1 w-0 min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-foreground"
          title={text}
        >
          {text}
        </span>

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

  // Get nested dotted path from an object, e.g., getByPath(obj, "data.win.system.message")
  function getByPath(obj: any, path: string) {
    try {
      return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
    } catch {
      return undefined;
    }
  }

  // Decide which dynamic fields to show in the table based on selection.
  // - If nothing except _source is selected => show only _source.
  // - Otherwise, show all selected fields except _source and @timestamp (Time is fixed).
  const dynamicFields = useMemo(() => {
    const nonSource = selectedFields.filter((f) => f !== "_source");
    if (nonSource.length === 0) return ["_source"];
    return nonSource.filter((f) => f !== "@timestamp");
  }, [selectedFields]);

  // Pretty label for headers (you can tweak if you want nicer titles)
  const headerLabel = (f: string) => (f === "_source" ? "Document" : f);

  // Resolve a value for a given field from a row.
  // Priorities:
  //  - Special cases (time, index, _source)
  //  - Known flattened fields from backend (agent, level, description)
  //  - Fallback to row._source (when backend starts returning it) via dotted path
  //  - Else, try direct flat property; else "—"
  function valueForField(row: any, field: string): any {
    if (field === "_source") {
      // Prefer full _source if present; else compact view of the row
      const src = row?._source;
      if (src) {
        try {
          return JSON.stringify(src);
        } catch {
          return "[object]";
        }
      }
      // Fallback: compose a tiny summary from known columns
      const summary: any = {};
      if (row.agent) summary["agent.name"] = row.agent;
      if (row.level != null) summary["rule.level"] = row.level;
      if (row.description) summary["rule.description"] = row.description;
      try {
        const s = JSON.stringify(summary);
        return s === "{}" ? "—" : s;
      } catch {
        return "—";
      }
    }

    if (field === "@timestamp" || field === "timestamp") {
      return row.time ?? row["@timestamp"] ?? row["timestamp"] ?? "—";
    }

    // Map common dotted paths to flattened fields you already return
    if (field === "agent.name")
      return row.agent ?? getByPath(row?._source, field) ?? "—";
    if (field === "rule.level")
      return row.level ?? getByPath(row?._source, field) ?? "—";
    if (field === "rule.description")
      return row.description ?? getByPath(row?._source, field) ?? "—";

    // Fallbacks
    const direct = row[field];
    if (direct != null) return direct;

    const dotted = getByPath(row?._source, field);
    if (dotted != null) return dotted;

    return "—";
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="py-2 px-6 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">EVENT SEARCH</h1>
            <DateTimeFilter
              value={timeRange}
              summary={
                startLabel && endLabel
                  ? `${startLabel} — ${endLabel}`
                  : undefined
              }
              onApply={(r) => {
                setTimeRange(r);
                setAnchorNow(Date.now()); // <— freeze "now" here
                setPage(1);
                setPageInput("1");
              }}
            />
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
                      {e.id}
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
                    <span className="font-bold">
                      {logsLoading ? (
                        <Skeleton />
                      ) : (
                        totalResults?.toLocaleString("en-IN")
                      )}
                    </span>{" "}
                    matching events
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {logsLoading
                    ? "…"
                    : `${paginated.startTime || "-"} — ${
                        paginated.endTime || "-"
                      }`}
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
            <div className="flex-1 overflow-hidden p-2">
              <div
                id="event-table-scroll"
                className="h-full overflow-auto rounded-xl border border-border custom-scroll px-2"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>Serial</TableHead>
                      <TableHead>Time</TableHead>
                      {dynamicFields.map((f) => (
                        <TableHead key={`h-${f}`}>{headerLabel(f)}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {logsLoading && !logsError && (
                      <SkeletonTableRows
                        rows={10}
                        cols={2 + dynamicFields.length}
                      />
                    )}

                    {!logsLoading && logsError && (
                      <TableRow>
                        <TableCell
                          colSpan={2 + dynamicFields.length}
                          className="text-center text-sm text-red-400"
                        >
                          Failed to fetch logs
                        </TableCell>
                      </TableRow>
                    )}

                    {!logsLoading && !logsError && logsData.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={2 + dynamicFields.length}
                          className="text-center text-sm text-muted-foreground"
                        >
                          No Data Found
                        </TableCell>
                      </TableRow>
                    )}

                    {!logsLoading &&
                      !logsError &&
                      logsData.length > 0 &&
                      logsData.map((row: any, i: number) => {
                        const docId = row._id ?? row.id;
                        const indexName = row._index ?? selectedPattern;

                        // robust serial fallback if backend didn't send one
                        const serial =
                          row.serial ?? (page - 1) * pageSize + (i + 1);

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
                            {/* Serial (fixed) */}
                            <TableCell className="text-xs">{serial}</TableCell>

                            {/* Time (fixed) */}
                            <TableCell className="text-xs">
                              {row.time ??
                                row["@timestamp"] ??
                                row["timestamp"] ??
                                "—"}
                            </TableCell>

                            {/* Dynamic fields (default: "_source" → "Document") */}
                            {dynamicFields.map((f) => {
                              const v = valueForField(row, f);
                              const s =
                                typeof v === "string"
                                  ? truncate(v, 120)
                                  : typeof v === "number"
                                  ? v
                                  : v == null
                                  ? "—"
                                  : String(v);
                              return (
                                <TableCell
                                  key={`c-${f}`}
                                  className="text-xs text-muted-foreground"
                                >
                                  {s}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
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
      {/* Floating pagination controls */}
      <div className="pointer-events-none fixed left-1/2 bottom-6 z-50 -translate-x-1/2">
        <div
          className="pointer-events-auto backdrop-blur-sm bg-card/60 hover:bg-card/95 transition-opacity
                  border border-border shadow-xl rounded-md px-3 py-2 flex items-center gap-2
                  opacity-60 hover:opacity-100"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => {
              setPage(1);
              setPageInput("1");
            }}
            disabled={page <= 1}
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => {
              const next = Math.max(1, page - 1);
              setPage(next);
              setPageInput(String(next));
            }}
            disabled={page <= 1}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* current page input */}
          <div className="flex items-center gap-2 text-sm">
            <Input
              className="h-8 w-16 text-center"
              value={pageInput}
              onChange={(e) =>
                setPageInput(e.target.value.replace(/[^\d]/g, ""))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const n = Math.max(
                    1,
                    Math.min(
                      Number(pageInput || "1"),
                      paginated.totalPages || 1
                    )
                  );
                  setPage(n);
                  setPageInput(String(n));
                }
              }}
            />
            <span className="text-muted-foreground">
              / {paginated.totalPages || 1}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => {
              // If user typed a number but didn't press Enter, next should still go from the current page
              const next = Math.min(page + 1, paginated.totalPages || page + 1);
              setPage(next);
              setPageInput(String(next));
            }}
            disabled={!paginated.hasNext}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => {
              const last = paginated.totalPages || 1;
              setPage(last);
              setPageInput(String(last));
            }}
            disabled={page >= (paginated.totalPages || 1)}
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
