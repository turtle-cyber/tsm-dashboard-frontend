// Mock data for SIEM dashboard components

export const severityData = [
  { severity: "Critical", count: 721, color: "hsl(var(--critical))" },
  { severity: "High", count: 2423, color: "hsl(var(--high))" },
  { severity: "Medium", count: 6538, color: "hsl(var(--medium))" },
  { severity: "Low", count: 3188, color: "hsl(var(--low))" },
  { severity: "Info", count: 9672, color: "hsl(var(--info))" }
];

export const classificationData = [
  { name: "MANUAL", value: 56.92, color: "hsl(var(--chart-1))" },
  { name: "MALWARE", value: 23.70, color: "hsl(var(--chart-2))" },
  { name: "ENUMERATION", value: 6.77, color: "hsl(var(--chart-3))" },
  { name: "NETWORK", value: 4.34, color: "hsl(var(--chart-4))" },
  { name: "RANSOMWARE", value: 3.07, color: "hsl(var(--chart-5))" },
  { name: "UNKNOWN", value: 2.65, color: "hsl(var(--chart-6))" }
];

export const alertsOverTimeData = [
  { time: "8 May", Hacktool: 30, "Info Stealer": 25, Malware: 45, Manual: 60, Other: 15 },
  { time: "9 May", Hacktool: 45, "Info Stealer": 35, Malware: 55, Manual: 70, Other: 20 },
  { time: "10 May", Hacktool: 65, "Info Stealer": 50, Malware: 75, Manual: 85, Other: 25 },
  { time: "11 May", Hacktool: 55, "Info Stealer": 45, Malware: 65, Manual: 80, Other: 30 },
  { time: "12 May", Hacktool: 75, "Info Stealer": 60, Malware: 85, Manual: 95, Other: 35 }
];

export const alertsTimeLineConfig = [
  { dataKey: "Hacktool", color: "hsl(var(--chart-1))", name: "Hacktool" },
  { dataKey: "Info Stealer", color: "hsl(var(--chart-2))", name: "Info Stealer" },
  { dataKey: "Malware", color: "hsl(var(--chart-3))", name: "Malware" },
  { dataKey: "Manual", color: "hsl(var(--chart-4))", name: "Manual" },
  { dataKey: "Other", color: "hsl(var(--chart-5))", name: "Other" }
];

export const highValueAssetsData = [
  {
    assetName: "5800x3D",
    unresolvedAlerts: 266,
    riskFactors: ["crown", "copy"],
    category: "Workstation"
  },
  {
    assetName: "ABRAX",
    unresolvedAlerts: 3,
    riskFactors: ["warning", "alert-circle", "users"],
    category: "Workstation"
  },
  {
    assetName: "accio-win2022-rso",
    unresolvedAlerts: 1,
    riskFactors: ["warning"],
    category: "Server"
  },
  {
    assetName: "Accra-DC",
    unresolvedAlerts: 6,
    riskFactors: ["warning"],
    category: "Server"
  }
];

export const agentsAttentionData = [
  { name: "Reboot Needed", value: 15.09, color: "hsl(var(--chart-1))" },
  { name: "Rebootless", value: 15.09, color: "hsl(var(--chart-2))" },
  { name: "NE CP Not Active", value: 15.09, color: "hsl(var(--chart-3))" },
  { name: "Pending", value: 15.09, color: "hsl(var(--chart-4))" },
  { name: "Upgrade Needed", value: 1.89, color: "hsl(var(--chart-5))" },
  { name: "External", value: 11.32, color: "hsl(var(--chart-6))" },
  { name: "Up to date", value: 11.32, color: "hsl(var(--medium))" }
];

export const alertsTableData = [
  {
    id: "1",
    reportedTime: "Dec 2, 2024 3:47:34 AM",
    alertName: "Pass-The-Hash Attack Detected",
    severity: "high" as const,
    mitreTechnique: "T1550.002",
    verdict: "99.2%",
    status: "new"
  },
  {
    id: "2", 
    reportedTime: "Dec 2, 2024 3:47:39 AM",
    alertName: "Pass-The-Hash Attack Detected", 
    severity: "high" as const,
    mitreTechnique: "T1550.002",
    verdict: "98.7%",
    status: "new"
  },
  {
    id: "3",
    reportedTime: "Dec 2, 2024 3:47:44 AM",
    alertName: "DCSync Attack Detected",
    severity: "critical" as const,
    mitreTechnique: "T1003.006", 
    verdict: "99.9%",
    status: "new"
  },
  {
    id: "4",
    reportedTime: "Dec 2, 2024 4:00:24 AM",
    alertName: "Pass-The-Hash Attack Detected",
    severity: "high" as const,
    mitreTechnique: "T1550.002",
    verdict: "97.3%",
    status: "investigating"
  },
  {
    id: "5",
    reportedTime: "Dec 2, 2024 4:00:25 AM", 
    alertName: "Pass-The-Hash Attack Detected",
    severity: "high" as const,
    mitreTechnique: "T1550.002",
    verdict: "98.1%",
    status: "new"
  }
];

export const alertDetails = {
  title: "DCSync Attack Detected",
  severity: "critical" as const,
  status: "Unknown",
  timestamp: "Dec 2, 2024 3:47:44 AM",
  description: "A critical alert has been generated indicating a DCSync attack detected on the domain 'PRAJAYA.LOCAL', specifically involving the server 'DC01' (IP: 10.232.207.250). The attack is categorized under Credential Access, utilizing the OS Credential Dumping technique (MITRE ATT&CK ID: TA006). The source of the suspicious activity originated from an endpoint with IP 10.232.226.121, suggesting potential privilege escalation due to an authorized session with elevated privileges. This incident highlights a significant security risk, necessitating immediate investigation and response to mitigate potential identity compromise.",
  aiVerdict: {
    confidence: 99,
    description: "Community Verdict (True Positive, not Benign)"
  },
  similarityScore: "1,000+",
  indicators: [
    {
      type: "Process",
      value: "lsass.exe",
      description: "Suspicious process access pattern detected"
    },
    {
      type: "Registry", 
      value: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa",
      description: "Registry modification attempt"
    },
    {
      type: "Network",
      value: "10.232.207.250:389",
      description: "LDAP connection to domain controller"
    }
  ],
  mitigationSteps: [
    "Immediately isolate the affected endpoint (10.232.226.121)",
    "Reset credentials for potentially compromised accounts",
    "Review and update domain controller security policies", 
    "Implement additional monitoring on the domain controller",
    "Conduct forensic analysis of the attack timeline"
  ]
};