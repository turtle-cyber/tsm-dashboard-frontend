import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

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
