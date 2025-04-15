
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Icons } from "@/components/shared/Icons";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { profile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
        icon={<Icons.settings className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1">
          <Card className="p-4">
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
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <Icons.x className="h-4 w-4 mr-2" />
                ) : (
                  <Icons.edit className="h-4 w-4 mr-2" />
                )}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                ) : (
                  <div className="bg-muted rounded-md p-3">
                    {profile?.name || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                ) : (
                  <div className="bg-muted rounded-md p-3">
                    {profile?.email || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <Label>Role</Label>
                <div className="bg-muted rounded-md p-3 capitalize">
                  {profile?.role || "user"}
                </div>
              </div>

              {profile?.companyName && (
                <div>
                  <Label>Company</Label>
                  <div className="bg-muted rounded-md p-3">
                    {profile.companyName}
                  </div>
                </div>
              )}

              {isEditing && (
                <Button type="submit" className="mt-4">
                  Save Changes
                </Button>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
