
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Icons } from "./Icons";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Base navigation items
  const baseNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: Icons.dashboard },
    { name: "Tasks", path: "/tasks", icon: Icons.tasks },
    { name: "To-Do Lists", path: "/todos", icon: Icons.todos },
    { name: "Calendar", path: "/calendar", icon: Icons.calendar },
  ];
  
  // Role-specific navigation items
  const roleNavItems = {
    superadmin: [
      { name: "Companies", path: "/companies", icon: Icons.users },
      { name: "Analytics", path: "/analytics", icon: Icons.chart },
    ],
    admin: [
      { name: "Team", path: "/team", icon: Icons.users },
      { name: "Analytics", path: "/analytics", icon: Icons.chart },
    ],
    user: [],
  };
  
  // Combine navigation items based on user role
  const navItems = [
    ...baseNavItems,
    ...(user ? roleNavItems[user.role] : []),
  ];
  
  // Account navigation items
  const accountNavItems = [
    { name: "Settings", path: "/settings", icon: Icons.settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between py-6 px-3">
        <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span>TempoTask</span>
        </Link>
        <SidebarTrigger>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icons.menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="mt-4 px-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2">
            ACCOUNT
          </div>
          <SidebarMenu>
            {accountNavItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-3">
        {user && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Icons.user className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user.role}
                  {user.companyName && ` • ${user.companyName}`}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={logout}
            >
              <Icons.logout className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
