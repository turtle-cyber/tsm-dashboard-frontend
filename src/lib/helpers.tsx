import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TableRow, TableCell } from "@/ui/table";
import { Skeleton } from "@/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonTableRows {
  rows?: number; // number of skeleton rows
  cols?: number; // number of columns to show
  cellHeight?: string; // Tailwind height class
}

export function SkeletonTableRows({
  rows = 10,
  cols = 5,
  cellHeight = "h-4",
}: SkeletonTableRows) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={`sk-${i}`} className="border-border">
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={`sk-${i}-${j}`} className="text-xs">
              <Skeleton className={`${cellHeight} w-full`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function formatTimestamp(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const millis = String(date.getMilliseconds()).padStart(3, "0");

  return `${month} ${day} @ ${year}, ${time}.${millis}`;
}

// Supports strings like: now, now-15m, now-1h, now-24h, now-7d, now-1M, now-1y
export function resolveNowRelativeToISO(rel: string, now = new Date()): string {
  if (!rel || rel === "now") return new Date(now).toISOString();
  const m = /^now-(\d+)([smhdwMy])$/.exec(rel);
  if (!m) return rel; // assume already ISO
  const n = parseInt(m[1], 10);
  const u = m[2] as "s" | "m" | "h" | "d" | "w" | "M" | "y";
  const d = new Date(now);
  const ops = {
    s: () => d.setSeconds(d.getSeconds() - n),
    m: () => d.setMinutes(d.getMinutes() - n),
    h: () => d.setHours(d.getHours() - n),
    d: () => d.setDate(d.getDate() - n),
    w: () => d.setDate(d.getDate() - 7 * n),
    M: () => d.setMonth(d.getMonth() - n),
    y: () => d.setFullYear(d.getFullYear() - n),
  };
  ops[u]();
  return d.toISOString();
}

export type CanonicalRange =
  | { mode: "relative"; from: string; to: string } // e.g. now-24h -> now
  | { mode: "absolute"; from: string; to: string }; // ISO strings

// Indian + short (K/L/Cr) formatter
export function toFixedTrim(n: number, frac = 1) {
  return n.toFixed(frac).replace(/\.0+$|(?<=\.\d*?)0+$/g, "");
}

export function formatFullIN(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatAbbrevIN(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1e7) return `${sign}${toFixedTrim(abs / 1e7)} Cr`;
  if (abs >= 1e5) return `${sign}${toFixedTrim(abs / 1e5)} L`;
  if (abs >= 1e3) return `${sign}${toFixedTrim(abs / 1e3)} K`;
  return `${sign}${formatFullIN(abs)}`;
}

interface TruncTextProps {
  value?: string | number;
  maxWidth?: string; // e.g. "max-w-[140px]"
  className?: string;
  side?: "top" | "right" | "bottom" | "left"; // optional for tooltip position
}

export function TruncText({
  value,
  maxWidth = "max-w-[140px]",
  className = "",
  side = "top",
}: TruncTextProps) {
  const text = value?.toString() ?? "—";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`truncate ${maxWidth} whitespace-nowrap overflow-hidden ${className}`}
        >
          {text}
        </div>
      </TooltipTrigger>
      <TooltipContent side={side}>{text}</TooltipContent>
    </Tooltip>
  );
}
