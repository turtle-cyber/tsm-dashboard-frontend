// Mock data for Threats list page
export interface ThreatListItem {
  id: string;
  firstSeen: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  threatName: string;
  mitreTechniques: string[];
  affectedEndpoints: number;
  status: 'mitigated' | 'active' | 'investigating' | 'resolved';
  lastAction: string;
  analystVerdict: 'true_positive' | 'false_positive' | 'pending' | 'in_review';
  confidence: 'high' | 'medium' | 'low' | 'suspicious';
}

export const mockThreatsList: ThreatListItem[] = [
  {
    id: "threat_001",
    firstSeen: "2024-01-18 12:22:33",
    severity: "critical",
    threatName: "Malicious PowerShell Execution",
    mitreTechniques: ["T1055.012", "T1059.001"],
    affectedEndpoints: 2,
    status: "mitigated",
    lastAction: "Process killed",
    analystVerdict: "true_positive",
    confidence: "high"
  },
  {
    id: "threat_002", 
    firstSeen: "2024-01-18 14:15:22",
    severity: "high",
    threatName: "Suspicious Registry Modification",
    mitreTechniques: ["T1112", "T1547.001"],
    affectedEndpoints: 1,
    status: "investigating",
    lastAction: "Quarantined",
    analystVerdict: "pending",
    confidence: "medium"
  },
  {
    id: "threat_003",
    firstSeen: "2024-01-18 16:45:11",
    severity: "medium",
    threatName: "Unusual Network Communication",
    mitreTechniques: ["T1071.001", "T1095"],
    affectedEndpoints: 3,
    status: "active",
    lastAction: "Network isolation",
    analystVerdict: "in_review",
    confidence: "medium"
  },
  {
    id: "threat_004",
    firstSeen: "2024-01-18 09:30:45",
    severity: "high",
    threatName: "Credential Dumping Attempt",
    mitreTechniques: ["T1003.001", "T1078"],
    affectedEndpoints: 1,
    status: "resolved",
    lastAction: "Credentials reset",
    analystVerdict: "true_positive",
    confidence: "high"
  },
  {
    id: "threat_005",
    firstSeen: "2024-01-17 22:18:33",
    severity: "low",
    threatName: "Suspicious File Creation",
    mitreTechniques: ["T1036.005"],
    affectedEndpoints: 1,
    status: "mitigated",
    lastAction: "File removed",
    analystVerdict: "false_positive",
    confidence: "low"
  },
  {
    id: "threat_006",
    firstSeen: "2024-01-17 18:42:17",
    severity: "critical",
    threatName: "Ransomware Activity Detected",
    mitreTechniques: ["T1486", "T1027", "T1055"],
    affectedEndpoints: 5,
    status: "investigating",
    lastAction: "Endpoints isolated", 
    analystVerdict: "true_positive",
    confidence: "high"
  },
  {
    id: "threat_007",
    firstSeen: "2024-01-17 15:23:55",
    severity: "medium",
    threatName: "Privilege Escalation Attempt",
    mitreTechniques: ["T1068", "T1134"],
    affectedEndpoints: 2,
    status: "resolved",
    lastAction: "Patched vulnerability",
    analystVerdict: "true_positive",
    confidence: "medium"
  },
  {
    id: "threat_008",
    firstSeen: "2024-01-17 11:55:29",
    severity: "high",
    threatName: "Lateral Movement Detected",
    mitreTechniques: ["T1021.001", "T1083"],
    affectedEndpoints: 4,
    status: "active",
    lastAction: "Network segmentation applied",
    analystVerdict: "pending",
    confidence: "high"
  }
];

export const threatTimeRanges = [
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Custom Range", value: "custom" }
];

export const threatSeverityFilters = [
  { label: "All", value: "all", count: 8 },
  { label: "Critical", value: "critical", count: 2 },
  { label: "High", value: "high", count: 3 },
  { label: "Medium", value: "medium", count: 2 },
  { label: "Low", value: "low", count: 1 }
];