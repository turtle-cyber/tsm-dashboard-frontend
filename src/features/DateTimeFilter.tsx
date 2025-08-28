import * as React from "react";
import { useState, useMemo } from "react";
import { addHours, addDays, formatISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ChevronDown, Filter } from "lucide-react";
import { resolveNowRelativeToISO, type CanonicalRange } from "../lib/helpers";

type Props = {
  value: CanonicalRange;
  onApply: (r: CanonicalRange) => void;
  summary?: string; // optional label from backend (e.g., "Aug 13 @ ... — Aug 13 @ ...")
};

const PRESETS: Array<{ label: string; from: string; to: string }> = [
  { label: "Last 15 minutes", from: "now-15m", to: "now" },
  { label: "Last 1 hour", from: "now-1h", to: "now" },
  { label: "Last 6 hours", from: "now-6h", to: "now" },
  { label: "Last 24 hours", from: "now-24h", to: "now" },
  { label: "Last 7 days", from: "now-7d", to: "now" },
];

export default function DateTimeFilter({ value, onApply, summary }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"relative" | "absolute">(value.mode);
  // below PRESETS, inside DateTimeFilter()
  const activePreset = useMemo(() => {
    if (value.mode !== "relative") return null;
    return (
      PRESETS.find((p) => p.from === value.from && p.to === value.to)?.label ??
      null
    );
  }, [value]);

  // Relative state
  const [relFrom, setRelFrom] = useState(
    value.mode === "relative" ? value.from : "now-24h"
  );
  const [relTo, setRelTo] = useState(
    value.mode === "relative" ? value.to : "now"
  );

  // Absolute state (date + time)
  const initStart =
    value.mode === "absolute"
      ? new Date(value.from)
      : addHours(new Date(), -24);
  const initEnd = value.mode === "absolute" ? new Date(value.to) : new Date();
  const [absStartDate, setAbsStartDate] = useState<Date>(initStart);
  const [absEndDate, setAbsEndDate] = useState<Date>(initEnd);
  const [absStartTime, setAbsStartTime] = useState<string>(
    initStart.toTimeString().slice(0, 5)
  ); // HH:MM
  const [absEndTime, setAbsEndTime] = useState<string>(
    initEnd.toTimeString().slice(0, 5)
  );

  const buttonLabel =
    summary ||
    (value.mode === "relative"
      ? PRESETS.find((p) => p.from === value.from && p.to === value.to)
          ?.label || "Custom range"
      : `${new Date(value.from).toLocaleString()} — ${new Date(
          value.to
        ).toLocaleString()}`);

  function applyRelative(f: string, t: string) {
    onApply({ mode: "relative", from: f, to: t });
    setOpen(false);
    setMode("relative");
  }

  function applyAbsolute() {
    const [sh, sm] = absStartTime.split(":").map(Number);
    const [eh, em] = absEndTime.split(":").map(Number);
    const start = new Date(absStartDate);
    start.setHours(sh || 0, sm || 0, 0, 0);
    const end = new Date(absEndDate);
    end.setHours(eh || 0, em || 0, 0, 0);
    onApply({
      mode: "absolute",
      from: start.toISOString(),
      to: end.toISOString(),
    });
    setOpen(false);
    setMode("absolute");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="truncate max-w-[46ch]">{buttonLabel}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[720px] p-3">
        {/* Header tabs */}
        <div className="flex items-center gap-2 border-b pb-2 mb-3">
          <Button
            size="sm"
            variant={mode === "relative" ? "default" : "secondary"}
            onClick={() => setMode("relative")}
          >
            Relative
          </Button>
          <Button
            size="sm"
            variant={mode === "absolute" ? "default" : "secondary"}
            onClick={() => setMode("absolute")}
          >
            Absolute
          </Button>
        </div>

        {/* Relative presets */}
        {mode === "relative" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {PRESETS.map((p) => {
                const active = activePreset === p.label;
                return (
                  <Button
                    key={p.label}
                    variant={active ? "default" : "secondary"}
                    size="sm"
                    aria-pressed={active}
                    className={`justify-start transition-colors
          ${
            active
              ? "ring-1 ring-primary/60 shadow-sm"
              : "hover:bg-secondary/10 hover:text-primary"
          }`}
                    onClick={() => applyRelative(p.from, p.to)}
                    title={p.label}
                  >
                    {p.label}
                  </Button>
                );
              })}
            </div>

            <div className="col-span-2 mt-2 grid grid-cols-2 gap-2">
              <Input
                placeholder="from (e.g. now-24h or ISO)"
                value={relFrom}
                onChange={(e) => setRelFrom(e.target.value)}
              />
              <Input
                placeholder="to (e.g. now or ISO)"
                value={relTo}
                onChange={(e) => setRelTo(e.target.value)}
              />
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => applyRelative(relFrom, relTo)}>
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* Absolute range */}
        {mode === "absolute" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs mb-1">Start date</div>
              <DayPicker
                mode="single"
                selected={absStartDate}
                onSelect={(d) => d && setAbsStartDate(d)}
                disabled={(d) => d > absEndDate}
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs w-16 text-muted-foreground">Time</span>
                <Input
                  className="h-8"
                  type="time"
                  step={60}
                  value={absStartTime}
                  onChange={(e) => setAbsStartTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="text-xs mb-1">End date</div>
              <DayPicker
                mode="single"
                selected={absEndDate}
                onSelect={(d) => d && setAbsEndDate(d)}
                disabled={(d) => d < absStartDate}
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs w-16 text-muted-foreground">Time</span>
                <Input
                  className="h-8"
                  type="time"
                  step={60}
                  value={absEndTime}
                  onChange={(e) => setAbsEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-2 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={applyAbsolute}>
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
