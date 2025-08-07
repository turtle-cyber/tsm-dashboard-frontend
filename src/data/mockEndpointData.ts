// Mock data for Endpoints page
export interface EndpointData {
  id: string;
  endpointName: string;
  account: string;
  site: string;
  lastLoggedInUser: string;
  group: string;
  domain: string;
  consoleVisibleIP: string;
  agentVersion: string;
  lastActive: string;
  status: 'online' | 'offline' | 'pending';
  osType: 'windows' | 'linux' | 'macos' | 'android';
  policy: string;
}

export const mockEndpoints: EndpointData[] = [
  {
    id: "ep_001",
    endpointName: "TestWins",
    account: "Pav8, Partners",
    site: "Lawrence Systems - 0d262b8b",
    lastLoggedInUser: "Lts",
    group: "Tom's Test",
    domain: "WORKGROUP",
    consoleVisibleIP: "154.21.114.181",
    agentVersion: "21.7.4.1043",
    lastActive: "Last 4 minutes",
    status: "online",
    osType: "windows",
    policy: "Detect"
  },
  {
    id: "ep_002", 
    endpointName: "PROD-WEB-01",
    account: "Corporate",
    site: "Data Center Alpha",
    lastLoggedInUser: "admin",
    group: "Production Servers",
    domain: "company.local",
    consoleVisibleIP: "192.168.1.100",
    agentVersion: "22.1.2.1156",
    lastActive: "Last 2 minutes",
    status: "online",
    osType: "linux",
    policy: "Protect"
  },
  {
    id: "ep_003",
    endpointName: "MacBook-Pro-15",
    account: "Corporate",
    site: "Corporate HQ",
    lastLoggedInUser: "j.doe",
    group: "Executive",
    domain: "company.local", 
    consoleVisibleIP: "192.168.1.45",
    agentVersion: "22.1.1.1089",
    lastActive: "Last 15 minutes",
    status: "online",
    osType: "macos",
    policy: "Detect"
  },
  {
    id: "ep_004",
    endpointName: "DC-01",
    account: "Corporate",
    site: "Data Center Alpha",
    lastLoggedInUser: "Administrator",
    group: "Domain Controllers",
    domain: "company.local",
    consoleVisibleIP: "192.168.1.200",
    agentVersion: "22.1.2.1156",
    lastActive: "Last 1 minute",
    status: "online",
    osType: "windows",
    policy: "Protect"
  },
  {
    id: "ep_005",
    endpointName: "android-device-001",
    account: "BYOD",
    site: "Remote",
    lastLoggedInUser: "guest",
    group: "Mobile Devices",
    domain: "N/A",
    consoleVisibleIP: "192.168.1.78",
    agentVersion: "21.9.1.892",
    lastActive: "Last 2 hours",
    status: "offline",
    osType: "android",
    policy: "Monitor"
  },
  {
    id: "ep_006",
    endpointName: "DEV-STAGING-02",
    account: "Development",
    site: "Development Lab",
    lastLoggedInUser: "devops",
    group: "Staging Environment",
    domain: "dev.local",
    consoleVisibleIP: "10.0.1.25",
    agentVersion: "22.1.1.1089",
    lastActive: "Last 30 minutes",
    status: "pending",
    osType: "linux",
    policy: "Detect"
  }
];

export const endpointFilterOptions = {
  accounts: ["Corporate", "Pav8, Partners", "Development", "BYOD"],
  sites: ["Data Center Alpha", "Corporate HQ", "Development Lab", "Remote", "Lawrence Systems - 0d262b8b"],
  groups: ["Tom's Test", "Production Servers", "Executive", "Domain Controllers", "Mobile Devices", "Staging Environment"],
  policies: ["Protect", "Detect", "Monitor"],
  status: ["online", "offline", "pending"]
};