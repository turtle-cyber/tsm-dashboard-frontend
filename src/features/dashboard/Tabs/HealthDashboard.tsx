// src/features/dashboard/tabs/HealthDashboard.tsx
import React from "react";

const HealthDashboard: React.FC = () => {
  const src =
  // "http://192.168.1.39:3000/d/ydddlIPWk/node-exporter-full" +
  // "?orgId=1&theme=dark&refresh=30s&from=now-1h&to=now" +
  // "&var-job=node&var-instance=localhost:9100" +
  // "&kiosk=tv";

  "http://192.168.1.39:3000/d/76641a52-56e1-4b67-849f-07c1adad4f57/node-exporter-embed?orgId=1&from=now-24h&to=now&timezone=browser&var-DS_PROMETHEUS=cewr2camelwxsd&var-job=node&var-nodename=wazuh-virtual-machine&var-node=localhost:9100&var-diskdevices=%5Ba-z%5D%2B%7Cnvme%5B0-9%5D%2Bn%5B0-9%5D%2B%7Cmmcblk%5B0-9%5D%2B&refresh=1mhttp://192.168.1.39:3000/d/76641a52-56e1-4b67-849f-07c1adad4f57/node-exporter-embed?orgId=1&from=now-24h&to=now&timezone=browser&var-DS_PROMETHEUS=cewr2camelwxsd&var-job=node&var-nodename=wazuh-virtual-machine&var-node=localhost:9100&var-diskdevices=%5Ba-z%5D%2B%7Cnvme%5B0-9%5D%2Bn%5B0-9%5D%2B%7Cmmcblk%5B0-9%5D%2B&refresh=1m"

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
