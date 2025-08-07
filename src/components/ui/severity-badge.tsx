import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const severityBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      severity: {
        critical: "bg-critical/10 text-critical border border-critical/20",
        high: "bg-high/10 text-high border border-high/20",
        medium: "bg-medium/10 text-medium border border-medium/20",
        low: "bg-low/10 text-low border border-low/20",
        info: "bg-info/10 text-info border border-info/20",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  }
);

export interface SeverityBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof severityBadgeVariants> {
  severity?: "critical" | "high" | "medium" | "low" | "info";
}

function SeverityBadge({ className, severity, ...props }: SeverityBadgeProps) {
  return (
    <div
      className={cn(severityBadgeVariants({ severity }), className)}
      {...props}
    />
  );
}

export { SeverityBadge, severityBadgeVariants };