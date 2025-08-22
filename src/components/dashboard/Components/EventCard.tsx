// components/EventCard.tsx
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatAbbrevIN, formatFullIN } from "@/lib/helpers";

type Variant = "critical" | "high" | "medium" | "low" | "neutral";

const VARIANT_STYLES: Record<
  Variant,
  {
    from: string;
    to: string;
    title: string;
    good: string;
    bad: string;
    neutral: string;
  }
> = {
  critical: {
    from: "from-red-700",
    to: "to-red-300/90",
    title: "text-red-400",
    good: "text-emerald-400", // ↓ good
    bad: "text-red-400", // ↑ bad
    neutral: "text-white/80",
  },
  high: {
    from: "from-orange-700",
    to: "to-orange-300/90",
    title: "text-orange-400",
    good: "text-emerald-400",
    bad: "text-red-400",
    neutral: "text-white/80",
  },
  medium: {
    from: "from-yellow-500",
    to: "to-yellow-100/90",
    title: "text-yellow-400",
    good: "text-emerald-400",
    bad: "text-red-400",
    neutral: "text-white/80",
  },
  low: {
    from: "from-gray-600",
    to: "to-gray-300/90",
    title: "text-gray-300",
    good: "text-emerald-400",
    bad: "text-red-400",
    neutral: "text-white/80",
  },
  neutral: {
    from: "from-muted-foreground",
    to: "to-muted/30",
    title: "text-muted-foreground",
    good: "text-emerald-400",
    bad: "text-red-400",
    neutral: "text-white/80",
  },
};

export default function EventCard({
  title,
  count,
  percentage,
  variant = "critical",
  className = "",
  loading = false,
  format = "ind",
}) {
  const styles = VARIANT_STYLES[variant];
  const pct = typeof percentage === "number" ? percentage : 0;
  const pctText = `${pct > 0 ? "+" : ""}${pct}%`;

  // Determine color + icon
  let pctColor = styles.neutral;
  let RightIcon: React.ReactNode = null;

  if (pct > 0) {
    pctColor = styles.bad; // red
    RightIcon = <TrendingUp className="h-4 w-4 opacity-80 text-red-400" />;
  } else if (pct < 0) {
    pctColor = styles.good; // green
    RightIcon = (
      <TrendingDown className="h-4 w-4 opacity-80 text-emerald-400" />
    );
  } else {
    pctColor = styles.neutral;
    RightIcon = <TrendingUp className="h-4 w-4 opacity-50 text-white/70" />;
  }

  // Count display + tooltip
  const isNumeric = typeof count === "number" || !isNaN(Number(count));
  const numericValue = typeof count === "number" ? count : Number(count);
  const displayValue = isNumeric ? formatAbbrevIN(numericValue) : String(count);
  const tooltipValue = isNumeric ? formatFullIN(numericValue) : String(count);

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-b p-[2px]",
        styles.from,
        styles.to,
        className
      )}
    >
      <Card className="h-full rounded-[0.7rem] bg-card">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <span className={cn("text-xs font-medium", styles.title)}>
              {title}
            </span>
            {RightIcon && (
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5">
                {RightIcon}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-end justify-between">
            <div
              className="font-semibold tracking-tight text-3xl"
              title={tooltipValue}
            >
              {displayValue}
            </div>
            <div className={cn("text-sm", pctColor)}>{pctText}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
