// Mock data for Threats page
export interface ThreatData {
  id: string;
  threatFileName: string;
  threatStatus: 'mitigated' | 'active' | 'investigating';
  aiConfidence: 'high' | 'medium' | 'low' | 'suspicious';
  analystVerdict: 'true_positive' | 'false_positive' | 'pending';
  incidentStatus: 'unresolved' | 'resolved' | 'in_progress';
  mitigationActions: {
    killed: number;
    quarantined: number;
    remediated: number;
    rolledBack: number;
  };
  firstSeen: string;
  lastSeen: string;
  endpointsAffected: number;
  accountsAffected: number;
  sitesAffected: number;
  groupsAffected: number;
  details: {
    path: string;
    commandLine: string;
    processUser: string;
    publisherName: string;
    signerIdentity: string;
    signatureVerification: string;
    originatingProcess: string;
    sha1: string;
    engine: string;
    detectionType: string;
    classification: string;
    fileSize: string;
    storyline: string;
    threatId: string;
  };
  threatIndicators: Array<{
    type: string;
    description: string;
    mitreId?: string;
    mitreDescription?: string;
  }>;
  endpoint: {
    hostname: string;
    scope: string;
    osVersion: string;
    agentVersion: string;
    policy: string;
    loggedInUser: string;
    uuid: string;
    domain: string;
    consoleConnectivity: string;
    fullDiskScan: string;
    pendingReboot: string;
    numberOfThreats: number;
  };
  notes: Array<{
    id: string;
    author: string;
    timestamp: string;
    content: string;
  }>;
}

export const mockThreatData: ThreatData = {
  id: "threat_001",
  threatFileName: "94766b75446916af24fe9850ba3b682a34d3d47aef9f2ab14d",
  threatStatus: "mitigated",
  aiConfidence: "suspicious",
  analystVerdict: "true_positive",
  incidentStatus: "unresolved",
  mitigationActions: {
    killed: 5,
    quarantined: 1,
    remediated: 4,
    rolledBack: 5
  },
  firstSeen: "Jan 18, 2022 12:22:33",
  lastSeen: "Jan 18, 2022 12:23:20",
  endpointsAffected: 2,
  accountsAffected: 1,
  sitesAffected: 1,
  groupsAffected: 1,
  details: {
    path: "\\Device\\HarddiskVolume3\\Users\\User\\Downloads\\94766b75446916af24fe9850ba3b682aba...",
    commandLine: "C:\\Users\\User\\Downloads\\94766b75446916af24fe9850ba3b682aba...",
    processUser: "TESTWHS\\User",
    publisherName: "",
    signerIdentity: "NotSigned",
    signatureVerification: "NotSigned",
    originatingProcess: "explorer.exe",
    sha1: "ca964bd5dd4b08fa0a06b1d33d47aef9f2ab14d",
    engine: "Documents, Scripts",
    detectionType: "Dynamic",
    classification: "Malware",
    fileSize: "67.08 KB",
    storyline: "25C9EPF479B1EDE3",
    threatId: "1336286039939582489"
  },
  threatIndicators: [
    {
      type: "Evasion",
      description: "Attempt to evade monitoring using the Process hollowing technique",
      mitreId: "T1055.012",
      mitreDescription: "Defense Evasion [T1055.012]"
    },
    {
      type: "Evasion", 
      description: "Code injection to other process memory space during the target process initialization",
      mitreId: "T1055.012",
      mitreDescription: "Defense Evasion [T1055.012]"
    },
    {
      type: "Exploitation",
      description: "Shellcode execution from Powershell was detected",
      mitreId: "T1059.001",
      mitreDescription: "Execution [T1059.001] [T1106]"
    },
    {
      type: "Injection",
      description: "Unusual code injection to a remote process",
      mitreId: "T1055",
      mitreDescription: "Defense Evasion [T1055]"
    },
    {
      type: "Injection",
      description: "Code injection to a remote process",
      mitreId: "T1055",
      mitreDescription: "Defense Evasion [T1055] [T1055.002]"
    }
  ],
  endpoint: {
    hostname: "TestWins",
    scope: "Pav8, Partners / Lawrence Systems - 0d262b8b-c640-4bc2-98d5-57bb2cdab217 / Tom's Test",
    osVersion: "Windows 10 Pro 19044",
    agentVersion: "21.7.4.1043",
    policy: "Detect",
    loggedInUser: "User",
    uuid: "f0207825e82643e4b8dc201c5b704464",
    domain: "WORKGROUP",
    consoleConnectivity: "Online",
    fullDiskScan: "Completed at Jan 02, 2022 10:15:34",
    pendingReboot: "No",
    numberOfThreats: 0
  },
  notes: [
    {
      id: "note_001",
      author: "Security Analyst",
      timestamp: "Jan 18, 2022 14:30:00",
      content: "Initial triage completed. Confirmed malicious activity. Process hollowing technique detected with PowerShell shellcode execution."
    },
    {
      id: "note_002", 
      author: "SOC Manager",
      timestamp: "Jan 18, 2022 15:45:00",
      content: "Escalated to incident response team. Recommend immediate containment of affected endpoint."
    }
  ]
};

export const mitreFrequencyData = [
  { technique: "T1055 - Process Injection", count: 45, description: "Defense Evasion" },
  { technique: "T1059.001 - PowerShell", count: 38, description: "Execution" },
  { technique: "T1027 - Obfuscated Files", count: 32, description: "Defense Evasion" },
  { technique: "T1086 - PowerShell", count: 28, description: "Execution" },
  { technique: "T1105 - Ingress Tool Transfer", count: 24, description: "Command and Control" },
  { technique: "T1012 - Query Registry", count: 21, description: "Discovery" },
  { technique: "T1082 - System Information", count: 19, description: "Discovery" },
  { technique: "T1497 - Virtualization Evasion", count: 16, description: "Defense Evasion" }
];