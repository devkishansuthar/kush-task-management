
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
        icon={<Icons.settings className="h-6 w-6 mr-2" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                <Icons.user className="h-5 w-5" />
                <span>Profile</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                <Icons.lock className="h-5 w-5" />
                <span>Security</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                <Icons.bell className="h-5 w-5" />
                <span>Notifications</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Name
                </label>
                <div className="bg-muted rounded-md p-3">
                  {user?.name || "User Name"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <div className="bg-muted rounded-md p-3">
                  {user?.email || "user@example.com"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Role
                </label>
                <div className="bg-muted rounded-md p-3 capitalize">
                  {user?.role || "user"}
                </div>
              </div>
              {user?.companyName && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Company
                  </label>
                  <div className="bg-muted rounded-md p-3">
                    {user.companyName}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
