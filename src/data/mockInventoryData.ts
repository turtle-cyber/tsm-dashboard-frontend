// Mock data for Device Inventory page
export interface DeviceData {
  id: string;
  type: 'workstation' | 'server' | 'smart_home' | 'iot' | 'mobile';
  ip: string;
  osType: 'windows' | 'linux' | 'macos' | 'android' | 'embedded';
  deviceFunction: string;
  osVersion: string;
  securedState: 'secured' | 'unsupported' | 'unsecured';
  hostName: string;
  networkName: string;
  manufacturer: string;
  domain: string;
  tags?: string[];
}

export interface KPIData {
  secured: number;
  unsupported: number;
  unsecured: number;
  total: number;
}

export const securedStateData: KPIData = {
  secured: 25,
  unsupported: 7,
  unsecured: 3,
  total: 35
};

export const deviceReviewData = [
  { name: "Reviewed", value: 28, color: "hsl(var(--chart-1))" },
  { name: "Unreviewed", value: 7, color: "hsl(var(--chart-2))" }
];

export const deviceTypeData = [
  { name: "Workstation", value: 10, color: "hsl(var(--chart-1))" },
  { name: "Audio Visual", value: 5, color: "hsl(var(--chart-2))" },
  { name: "Storage", value: 4, color: "hsl(var(--chart-3))" },
  { name: "Mobile", value: 2, color: "hsl(var(--chart-4))" },
  { name: "IoT", value: 2, color: "hsl(var(--chart-5))" },
  { name: "Smart Office", value: 2, color: "hsl(var(--chart-6))" },
  { name: "Printer", value: 1, color: "hsl(var(--muted-foreground))" },
  { name: "Network", value: 9, color: "hsl(var(--accent))" }
];

export const osTypeData = [
  { name: "Linux", value: 19, color: "hsl(var(--chart-1))" },
  { name: "Windows", value: 8, color: "hsl(var(--chart-2))" },
  { name: "Android", value: 2, color: "hsl(var(--chart-3))" },
  { name: "Apple", value: 1, color: "hsl(var(--chart-4))" },
  { name: "Unix", value: 1, color: "hsl(var(--chart-5))" },
  { name: "Windows Legacy", value: 2, color: "hsl(var(--chart-6))" },
  { name: "Cisco", value: 0, color: "hsl(var(--muted-foreground))" },
  { name: "MSP", value: 0, color: "hsl(var(--accent))" },
  { name: "Unknown", value: 2, color: "hsl(var(--destructive))" }
];

export const mockDevices: DeviceData[] = [
  {
    id: "dev_001",
    type: "workstation",
    ip: "192.168.1.80",
    osType: "windows",
    deviceFunction: "Workstation",
    osVersion: "Windows 10 Home",
    securedState: "secured",
    hostName: "ti-remotedesktop1",
    networkName: "N/A",
    manufacturer: "Dell Inc.",
    domain: "WORKGROUP",
    tags: ["Corporate", "Remote"]
  },
  {
    id: "dev_002",
    type: "workstation",
    ip: "192.168.56.1",
    osType: "windows",
    deviceFunction: "Workstation",
    osVersion: "Windows 11 Home",
    securedState: "secured",
    hostName: "ti-desktop4",
    networkName: "N/A",
    manufacturer: "N/A",
    domain: "WORKGROUP"
  },
  {
    id: "dev_003",
    type: "smart_home",
    ip: "192.168.86.29",
    osType: "embedded",
    deviceFunction: "Smart Home",
    osVersion: "Embedded",
    securedState: "unsupported",
    hostName: "N/A",
    networkName: "N/A",
    manufacturer: "Dexatel Technology LTD.",
    domain: "N/A"
  },
  {
    id: "dev_004",
    type: "iot",
    ip: "192.168.86.38",
    osType: "embedded",
    deviceFunction: "Unknown",
    osVersion: "Embedded",
    securedState: "unsupported",
    hostName: "N/A",
    networkName: "N/A",
    manufacturer: "Amazon Technologies Inc.",
    domain: "N/A"
  },
  {
    id: "dev_005",
    type: "server",
    ip: "192.168.1.100",
    osType: "linux",
    deviceFunction: "Server",
    osVersion: "Ubuntu 22.04 LTS",
    securedState: "secured",
    hostName: "prod-web-01",
    networkName: "Production",
    manufacturer: "HPE",
    domain: "company.local",
    tags: ["Production", "Web Server"]
  },
  {
    id: "dev_006",
    type: "workstation",
    ip: "192.168.1.45",
    osType: "macos",
    deviceFunction: "Workstation",
    osVersion: "macOS Ventura 13.6",
    securedState: "secured",
    hostName: "MacBook-Pro-15",
    networkName: "Corporate",
    manufacturer: "Apple Inc.",
    domain: "company.local",
    tags: ["Executive", "Mobile"]
  },
  {
    id: "dev_007",
    type: "server",
    ip: "192.168.1.200",
    osType: "windows",
    deviceFunction: "Server",
    osVersion: "Windows Server 2022",
    securedState: "secured",
    hostName: "DC-01",
    networkName: "Infrastructure",
    manufacturer: "Dell Inc.",
    domain: "company.local",
    tags: ["Domain Controller", "Critical"]
  },
  {
    id: "dev_008",
    type: "mobile",
    ip: "192.168.1.78",
    osType: "android",
    deviceFunction: "Mobile",
    osVersion: "Android 14",
    securedState: "unsecured",
    hostName: "android-device-001",
    networkName: "Guest",
    manufacturer: "Samsung",
    domain: "N/A",
    tags: ["BYOD"]
  }
];