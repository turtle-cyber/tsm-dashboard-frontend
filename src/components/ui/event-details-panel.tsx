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

// --- add this helper near the top, below getSeverityColor ---
const levelToSeverity = (lvl?: number) => {
  if (lvl == null || Number.isNaN(lvl)) return "info" as const;
  if (lvl >= 11) return "critical" as const; // 11–15
  if (lvl >= 8) return "high" as const; // 8–10
  if (lvl >= 5) return "medium" as const; // 5–7
  if (lvl >= 3) return "low" as const; // 3–4
  return "info" as const; // 0–2
};

// Keep fetching both paths; we'll choose at render time
const fieldsToFetch =
  "%40timestamp,manager.name,agent.name,agent.id,rule.level,rule.id,rule.description,location,full_log,data.win.system.eventID,data.win.system.providerName,data.win.system.computer,data.win.system.channel,data.win.system.message,data.win.eventdata.*";

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
        params: {
          indexName: doc.indexName,
          id: doc.id,
          source_includes: fieldsToFetch,
        },
      });

      if (res.status === 200) {
        setLogData(res.data);
      }

      const src = res.data?._source ?? {};
      const sev = String(src?.level ?? "info").toLowerCase();
      const severity: EventData["severity"] = (
        ["critical", "high", "medium", "low", "info"] as const
      ).includes(sev as any)
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

  // --------- NEW: decide which message to show ----------
  const isWindowsEvent = !!logData?._source?.data?.win;
  const sysMessage = logData?._source?.data?.win?.system?.message as
    | string
    | undefined;
  const fullLog = logData?._source?.full_log as string | undefined;

  // Prefer Windows system message for Windows events; otherwise prefer full_log (Linux/text).
  const rawMessage: string =
    (isWindowsEvent ? sysMessage : fullLog) ??
    sysMessage ??
    fullLog ??
    (logData?._source?.message as string | undefined) ??
    "";

  // ... inside the component, after fetching logData ...
  const ruleLevel: number | undefined = logData?._source?.rule?.level;
  const severityLabel = levelToSeverity(
    typeof ruleLevel === "string" ? parseInt(ruleLevel, 10) : ruleLevel
  );

  const messageHeading = isWindowsEvent ? "System Message" : "Full Log";
  // ------------------------------------------------------

  const cleanMessage = useMemo(
    () =>
      rawMessage
        ?.replace(/^"|"$/g, "") // strip wrapping quotes
        ?.replace(/\r\n/g, "\n") // normalize line breaks
        ?.replace(/\t/g, "    ") ?? "",
    [rawMessage]
  );

  // Safer event time selection
  const eventTime =
    (logData?._source?.["@timestamp"] as string | undefined) ||
    (logData?._source?.timestamp as string | undefined);

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
              <span className="text-md">{`Index : ${
                logData?._index ?? ""
              }`}</span>
              <span className="font-semibold text-lg">{}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{}</h2>
            <Badge className={cn("text-xs", getSeverityColor(severityLabel))}>
              {`Level ${ruleLevel ?? "—"} • ${severityLabel.toUpperCase()}`}
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
                    {eventTime ? formatTimestamp(eventTime) : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Source Manager Name:
                  </span>
                  <span className="text-foreground">
                    {logData?._source?.manager?.name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source Agent:</span>
                  <span className="text-foreground">
                    {logData?._source?.agent?.name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source IP:</span>
                  <span className="text-foreground ">
                    {logData?._source?.agent?.ip ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="text-foreground">
                    {logData?._source?.rule?.description ?? "—"}
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

            {/* System Message OR Full Log (expandable) */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                {messageHeading}
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
                    "whitespace-pre-wrap text-foreground leading-5",
                    sysExpanded
                      ? "max-h-72 overflow-y-auto pr-2"
                      : "max-h-[2.6rem] overflow-hidden",
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
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground/70">
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
