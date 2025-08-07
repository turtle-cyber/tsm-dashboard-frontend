// Mock data for Event Search page
export interface EventData {
  id: string;
  eventTime: string;
  vendor: {
    name: string;
    logo: string;
  };
  eventType: string;
  unmappedEventType: string;
  source: string;
  destination: string;
  sourceIP?: string;
  destIP?: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  details: Record<string, any>;
}

export interface EventField {
  name: string;
  count: number;
}

export const eventFields: EventField[] = [
  { name: "activity_name", count: 19 },
  { name: "actor_id_addr", count: 23 },
  { name: "actor.user.name", count: 19 },
  { name: "api.service.name", count: 1 },
  { name: "cloud.account.uid", count: 2 },
  { name: "cloud.provider", count: 1 },
  { name: "cmdScript.content", count: 5 },
  { name: "dataSource.vendor", count: 14 },
  { name: "device.hostname", count: 10 },
  { name: "device.ip", count: 7 },
  { name: "device.type", count: 4 },
  { name: "dst.user.address", count: 15 },
  { name: "dst.port.number", count: 5 },
  { name: "dst_endpoint.ip", count: 11 },
  { name: "dst_endpoint.name", count: 10 },
  { name: "endpoint.name", count: 82 },
  { name: "entity.name", count: 11 },
  { name: "event.category", count: 15 },
  { name: "event.dns.request", count: 10 },
  { name: "event.dns.response", count: 5 },
  { name: "event_id_created", count: 2 },
  { name: "event.login.type", count: 1 },
  { name: "event.i_username", count: 5 },
  { name: "event.i_dst_username", count: 2 },
  { name: "event.n_direction", count: 2 },
  { name: "file.name", count: 1 },
  { name: "http_uri_path", count: 9 },
];

export const mockEvents: EventData[] = [
  {
    id: "evt_001",
    eventTime: "Sep 16 2024 11:5 8:44",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "Registry Value Modified",
    unmappedEventType: "Registry Value Modified",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID C4EEFA9A1F4A7B91",
    severity: "medium",
    details: {
      actor: {
        user: {
          name: "SYSTEM"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-SERVER01",
        ip: "192.168.1.100"
      }
    }
  },
  {
    id: "evt_002",
    eventTime: "Sep 16 2024 11:5 8:44",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "IP Connect",
    unmappedEventType: "IP Connect",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID 7220FF9A1F4A7B91",
    severity: "low",
    details: {
      actor: {
        user: {
          name: "Administrator"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-DESKTOP04",
        ip: "192.168.1.45"
      }
    }
  },
  {
    id: "evt_003",
    eventTime: "Sep 16 2024 11:5 8:44",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "Task Delete",
    unmappedEventType: "Task Delete",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID EC2EFFAA1F4A7B91",
    severity: "info",
    details: {
      actor: {
        user: {
          name: "admin"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-WORKSTATION",
        ip: "192.168.1.201"
      }
    }
  },
  {
    id: "evt_004",
    eventTime: "Sep 16 2024 11:5 8:44",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "File Deletion",
    unmappedEventType: "File Deletion",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID 7220FF9A1F4A7B91",
    severity: "high",
    details: {
      actor: {
        user: {
          name: "SYSTEM"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-SERVER02",
        ip: "192.168.1.55"
      }
    }
  },
  {
    id: "evt_005",
    eventTime: "Sep 16 2024 11:5 8:43",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "IP Connect",
    unmappedEventType: "IP Connect",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID 7220FF9A1F4A7B91",
    severity: "low",
    details: {
      actor: {
        user: {
          name: "User"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-CLIENT01",
        ip: "192.168.1.80"
      }
    }
  },
  {
    id: "evt_006",
    eventTime: "Sep 16 2024 11:5 8:43",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "DNS Resolved",
    unmappedEventType: "DNS Resolved",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID AA2EFFAA1F4A7B91",
    severity: "info",
    details: {
      actor: {
        user: {
          name: "NetworkService"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-DNS01",
        ip: "192.168.1.10"
      }
    }
  },
  {
    id: "evt_007",
    eventTime: "Sep 16 2024 11:5 8:43",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "Open Remote Process Handle",
    unmappedEventType: "Open Remote Process Handle",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID F0FFF9A1F4A7B91",
    severity: "critical",
    details: {
      actor: {
        user: {
          name: "SYSTEM"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-CRITICAL",
        ip: "192.168.1.250"
      }
    }
  },
  {
    id: "evt_008",
    eventTime: "Sep 16 2024 11:5 8:43",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "IP Connect",
    unmappedEventType: "IP Connect",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID 7220FF9A1F4A7B91",
    severity: "medium",
    details: {
      actor: {
        user: {
          name: "ServiceAccount"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-SERVICE",
        ip: "192.168.1.150"
      }
    }
  },
  {
    id: "evt_009",
    eventTime: "Sep 16 2024 11:5 8:43",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "Module Load",
    unmappedEventType: "Module Load",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID BAF0F9A1F4A7B91",
    severity: "info",
    details: {
      actor: {
        user: {
          name: "LocalSystem"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-MODULE",
        ip: "192.168.1.75"
      }
    }
  },
  {
    id: "evt_010",
    eventTime: "Sep 16 2024 11:5 8:43",
    vendor: {
      name: "SentinelOne",
      logo: "🛡️"
    },
    eventType: "Registry Key Deleted",
    unmappedEventType: "Registry Key Deleted",
    source: "Agent UUID bbbc690e0e184fecaa05f1f...",
    destination: "Source Process Unique ID EC2EFFAA1F4A7B91",
    severity: "high",
    details: {
      actor: {
        user: {
          name: "Administrator"
        }
      },
      dataSource: {
        vendor: "SentinelOne"
      },
      device: {
        hostname: "WIN-REGISTRY",
        ip: "192.168.1.123"
      }
    }
  }
];

// Histogram data for event timeline
export const eventHistogramData = [
  { time: "8:00 AM", count: 45 },
  { time: "8:15 AM", count: 52 },
  { time: "8:30 AM", count: 38 },
  { time: "8:45 AM", count: 67 },
  { time: "9:00 AM", count: 72 },
  { time: "9:15 AM", count: 58 },
  { time: "9:30 AM", count: 43 },
  { time: "9:45 AM", count: 61 },
  { time: "10:00 AM", count: 55 },
  { time: "10:15 AM", count: 48 },
  { time: "10:30 AM", count: 39 },
  { time: "10:45 AM", count: 42 },
  { time: "11:00 AM", count: 35 },
  { time: "11:15 AM", count: 28 },
  { time: "11:30 AM", count: 33 },
  { time: "11:45 AM", count: 29 }
];