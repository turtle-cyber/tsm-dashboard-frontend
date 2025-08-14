// src/components/event-details/EventDetailsPanel.tsx
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { EventData } from "@/data/mockEventData";
import { useCallback, useEffect, useMemo, useState } from "react";
import { http } from "../../data/config";
import { GET_LOGS_BY_INDEX } from "@/constants/eventSearchEndpoints";
import { formatTimestamp } from "@/lib/helpers";

type DocRef = { indexName: string; id: string };

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

export default function EventDetailsPanel({
  doc,
  isOpen,
  onClose,
}: {
  doc: DocRef | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [logData, setLogData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sysExpanded, setSysExpanded] = useState(false);

  const load = useCallback(async () => {
    if (!doc) return;
    setLoading(true);
    setError(null);
    setLogData(null);

    try {
      const res = await http.get(GET_LOGS_BY_INDEX, {
        params: { indexName: doc.indexName, id: doc.id },
      });

      if (res.status == 200) {
        let logs = res.data;
        setLogData(logs);
      }

      const src = res.data?._source ?? res.data ?? {};
      const sev = String(src?.level ?? "info").toLowerCase();
      const severity: EventData["severity"] = [
        "critical",
        "high",
        "medium",
        "low",
        "info",
      ].includes(sev as any)
        ? (sev as EventData["severity"])
        : "info";
    } catch (e: any) {
      setError(e?.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  }, [doc]);

  useEffect(() => {
    if (isOpen && doc) load();
  }, [isOpen, doc, load]);

  const rawMessage: string =
    (logData?._source?.message as string) ||
    (logData?._source?.data?.win?.system?.message as string) ||
    "";

  const cleanMessage = useMemo(
    () =>
      rawMessage
        ?.replace(/^"|"$/g, "") // strip wrapping quotes
        ?.replace(/\r\n/g, "\n") // normalize line breaks
        ?.replace(/\t/g, "    ") ?? "",
    [rawMessage]
  );

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? undefined : onClose())}
    >
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
              <span className="text-md">{`Index : ${logData?._index}`}</span>
              <span className="font-semibold text-lg">{}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{}</h2>
            <Badge className={cn("text-xs", getSeverityColor("critical"))}>
              {}
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
                  <span className="text-muted-foreground">Event ID:</span>
                  <span className="text-foreground">{logData?._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Time:</span>
                  <span className="text-foreground">
                    {formatTimestamp(logData?._source.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Source Manager Name:
                  </span>
                  <span className="text-foreground">
                    {logData?._source.manager?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source Agent:</span>
                  <span className="text-foreground">
                    {logData?._source.agent.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source IP:</span>
                  <span className="text-foreground ">
                    {logData?._source.agent.ip}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="text-foreground">
                    {logData?._source.rule?.description}
                  </span>
                </div>
              </div>
            </div>
            <Separator />
            {/* Actor Details */}
            {true && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Actor
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User Name:</span>
                    <span className="text-foreground">{"N/A"}</span>
                  </div>
                </div>
              </div>
            )}
            <Separator />
            {/* Device Details */}
            {true && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Device
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hostname:</span>
                    <span className="text-foreground">{"N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="text-foreground">{"N/A"}</span>
                  </div>
                </div>
              </div>
            )}
            <Separator />

            {/* System Message (expandable) */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                System Message
              </h3>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setSysExpanded((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSysExpanded((v) => !v);
                  }
                }}
                className={cn(
                  "relative rounded-md border border-border bg-card/50 p-3 text-sm",
                  "hover:bg-secondary/40 transition-colors cursor-pointer"
                )}
                aria-expanded={sysExpanded}
              >
                <pre
                  className={cn(
                    "whitespace-pre-wrap text-foreground leading-5", // tighter line-height
                    sysExpanded
                      ? "max-h-72 overflow-y-auto pr-2" // scrollable when expanded
                      : "max-h-[2.6rem] overflow-hidden", // 2 lines when collapsed
                    "transition-[max-height] duration-200 ease-out"
                  )}
                >
                  {cleanMessage || "N/A"}
                </pre>

                {/* Fade + hint */}
                {cleanMessage && (
                  <>
                    {!sysExpanded ? (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-card/95 flex items-end justify-center">
                        <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground/70">
                          <span>Show more</span>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 flex items-end justify-center bg-gradient-to-t from-card/95 to-transparent">
                        <div className="mb-0.5 flex items-center gap-1 text-xs text-muted-foreground/60">
                          <span>Show less</span>
                          <ChevronUp className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
