// src/features/dashboard/tabs/HealthDashboard.tsx
import React from "react";

const HealthDashboard: React.FC = () => {
  const src =
  "http://192.168.1.39:3000/d/ydddlIPWk/node-exporter-full" +
  "?orgId=1&theme=dark&refresh=30s&from=now-1h&to=now" +
  "&var-job=node&var-instance=localhost:9100" +
  "&kiosk=tv";

  return (
    <div style={{
      width: "100%",
      height: "92vh",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
      }}>
       <iframe src={src} width="100%" height="100%" style={{ border: 0 }} />
    </div>

  );
};

export default HealthDashboard;
