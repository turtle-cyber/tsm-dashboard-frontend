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
  X,
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
} from "@/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboards",
    icon: BarChart3,
    url: "/",
    section: "main",
  },
];

const triageItems = [
  {
    title: "Alerts",
    icon: AlertTriangle,
    url: "/alerts",
    section: "triage",
  },
  {
    title: "Threats",
    icon: Shield,
    url: "/threats",
    section: "triage",
  },
  {
    title: "Exposures",
    icon: Shield,
    url: "/exposures",
    section: "triage",
  },
  {
    title: "Compliance",
    icon: CheckCircle,
    url: "/compliance",
    section: "triage",
  },
];

const discoverItems = [
  {
    title: "Event Search",
    icon: Search,
    url: "/event-search",
    section: "discover",
  },
  {
    title: "Inventory",
    icon: Package,
    url: "/inventory",
    section: "discover",
  },
  {
    title: "Graph Explorer",
    icon: Network,
    url: "/graph-explorer",
    section: "discover",
  },
  {
    title: "Activities",
    icon: Activity,
    url: "/activities",
    section: "discover",
  },
];

const complianceItems = [
  {
    title: "Alerts",
    icon: AlertTriangle,
    url: "/alerts",
    section: "compliance",
  },
  {
    title: "Exposures",
    icon: Shield,
    url: "/exposures",
    section: "compliance",
  },
  {
    title: "Compliance",
    icon: CheckCircle,
    url: "/compliance",
    section: "compliance",
  },
];

const automateItems = [
  {
    title: "Hyperautomation",
    icon: Zap,
    url: "/hyperautomation",
    section: "automate",
  },
  {
    title: "RemoteOps",
    icon: MonitorSpeaker,
    url: "/remoteops",
    section: "automate",
  },
];

const configureItems = [
  {
    title: "Detections",
    icon: Eye,
    url: "/detections",
    section: "configure",
  },
  {
    title: "Agent Management",
    icon: Users,
    url: "/agent-management",
    section: "configure",
  },
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
    items,
  }: {
    title: string;
    items: typeof navigationItems;
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
                  <NavLink
                    to={item.url}
                    className={getNavClasses(isActiveItem)}
                  >
                    <item.icon
                      className={cn("h-4 w-4", !collapsed && "mr-3")}
                    />
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
        <div className="p mb-2">
          <div className="flex items-center">
            {collapsed ? <img src="/favicon.ico" /> : <img src="/logo.svg" />}
          </div>
        </div>

        <SidebarSection title="HOME" items={navigationItems} />
        <SidebarSection title="TRIAGE" items={triageItems} />
        <SidebarSection title="DISCOVER" items={discoverItems} />
        <SidebarSection title="CONFIGURE" items={configureItems} />
      </SidebarContent>
    </Sidebar>
  );
}
