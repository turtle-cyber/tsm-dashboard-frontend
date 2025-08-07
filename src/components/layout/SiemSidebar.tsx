import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Brain,
  AlertTriangle,
  Shield,
  CheckCircle,
  Search,
  Package,
  Network,
  Activity,
  Zap,
  MonitorSpeaker,
  Eye,
  Users,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboards",
    icon: BarChart3,
    url: "/",
    section: "main"
  },
  {
    title: "Purple AI",
    icon: Brain,
    url: "/purple-ai",
    section: "main"
  }
];

const triageItems = [
  {
    title: "Alerts",
    icon: AlertTriangle,
    url: "/alerts",
    section: "triage"
  },
  {
    title: "Exposures",
    icon: Shield,
    url: "/exposures",
    section: "triage"
  },
  {
    title: "Compliance",
    icon: CheckCircle,
    url: "/compliance",
    section: "triage"
  }
];

const discoverItems = [
  {
    title: "Event Search",
    icon: Search,
    url: "/event-search",
    section: "discover"
  },
  {
    title: "Inventory",
    icon: Package,
    url: "/inventory",
    section: "discover"
  },
  {
    title: "Graph Explorer",
    icon: Network,
    url: "/graph-explorer",
    section: "discover"
  },
  {
    title: "Activities",
    icon: Activity,
    url: "/activities",
    section: "discover"
  }
];

const automateItems = [
  {
    title: "Hyperautomation",
    icon: Zap,
    url: "/hyperautomation",
    section: "automate"
  },
  {
    title: "RemoteOps",
    icon: MonitorSpeaker,
    url: "/remoteops",
    section: "automate"
  }
];

const configureItems = [
  {
    title: "Detections",
    icon: Eye,
    url: "/detections",
    section: "configure"
  },
  {
    title: "Agent Management",
    icon: Users,
    url: "/agent-management",
    section: "configure"
  }
];

export function SiemSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (isActiveItem: boolean) =>
    cn(
      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
      isActiveItem
        ? "bg-primary/10 text-primary border-l-2 border-primary"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    );

  const SidebarSection = ({ 
    title, 
    items 
  }: { 
    title: string; 
    items: typeof navigationItems 
  }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-3">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActiveItem = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className={getNavClasses(isActiveItem)}>
                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border bg-sidebar",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="py-4">
        <div className="px-3 mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
              <span className="text-xs font-bold text-primary-foreground">S</span>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <div className="text-sm font-semibold text-sidebar-foreground">Singularity™</div>
                <div className="text-xs text-muted-foreground">Operations Center</div>
              </div>
            )}
          </div>
        </div>

        <SidebarSection title="" items={navigationItems} />
        <SidebarSection title="TRIAGE" items={triageItems} />
        <SidebarSection title="DISCOVER" items={discoverItems} />
        <SidebarSection title="AUTOMATE" items={automateItems} />
        <SidebarSection title="CONFIGURE" items={configureItems} />
      </SidebarContent>
    </Sidebar>
  );
}