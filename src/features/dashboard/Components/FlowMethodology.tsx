import * as React from "react";
import { Card } from "@/features/ui/card";
import { ScanSearch, Workflow, Filter, ActivitySquare } from "lucide-react";

// ---- types ----
type Stage = {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  icon: React.ReactNode;
};

// ---- small pill chip ----
const Chip = ({ text }: { text: string }) => (
  <span className="whitespace-nowrap rounded-full border border-zinc-700/60 bg-zinc-900/60 px-2.5 py-0.5 text-[11px] leading-5 text-zinc-300">
    {text}
  </span>
);

// ---- a single stage card ----
function StageCard({ stage }: { stage: Stage }) {
  return (
    <div className="relative">
      <Card className="w-[300px] bg-zinc-900/60 border-zinc-800 rounded-2xl shadow-sm">
        <div className="p-4">
          <div className="mb-2 inline-flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#ae4b51] text-white">
              {/* icon size kept consistent */}
              <div className="[&>]:h-4 [&>]:w-4">{stage.icon}</div>
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">
              {stage.title}
            </h3>
          </div>

          <p className="text-xs text-zinc-400 leading-5">{stage.subtitle}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {stage.bullets.map((b, i) => (
              <Chip key={i} text={b} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ---- connector between cards (curved) ----
function Connector() {
  return (
    <div className="mx-2 hidden md:block">
      <svg width="72" height="40" viewBox="0 0 72 40" className="opacity-70">
        <path
          d="M2 38 C 24 6, 48 6, 70 38"
          fill="none"
          stroke="rgb(82,82,91)" /* zinc-600 */
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// ---- main flow component ----
export default function MethodologyFlow() {
  const stages: Stage[] = [
    {
      id: "event-id",
      title: "Event ID Pattern Recognition",
      subtitle:
        "Analyze sequences of Windows Event IDs to identify suspicious behavior patterns.",
      bullets: [
        "Event ID 4688 (Process Creation)",
        "Event ID 4104 (PS Script Block)",
      ],
      icon: <ScanSearch />,
    },
    {
      id: "behavioral-seq",
      title: "Behavioral Sequence Analysis",
      subtitle:
        "Build temporal models of process-execution chains and user context.",
      bullets: ["Parent-Child Process Relationships", "Timing Analysis"],
      icon: <Workflow />,
    },
    {
      id: "noise-filter",
      title: "Noise Reduction & Filtering",
      subtitle:
        "Distinguish malicious activity from legitimate administrative operations.",
      bullets: ["Whitelisted Known Processes", "Administrative Context"],
      icon: <Filter />,
    },
    {
      id: "anomaly",
      title: "Anomaly Detection",
      subtitle:
        "Identify deviations from normal system behavior using statistical models.",
      bullets: ["Statistical Outliers", "Machine Learning Models"],
      icon: <ActivitySquare />,
    },
  ];

  return (
    <div className="w-full pt-4">
      {/* horizontal rail; scroll on small screens */}
      <div className="relative overflow-x-auto pb-2">
        <div className="flex items-center">
          {stages.map((s, idx) => (
            <React.Fragment key={s.id}>
              <StageCard stage={s} />
              {idx < stages.length - 1 ? <Connector /> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
