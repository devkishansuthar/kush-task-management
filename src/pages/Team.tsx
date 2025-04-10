
import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Team: React.FC = () => {
  // Mock team members data
  const teamMembers = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Product Manager",
      email: "alex@example.com",
      avatarUrl: "",
      status: "active",
      tasksCompleted: 24,
    },
    {
      id: "2",
      name: "Sarah Williams",
      role: "UX Designer",
      email: "sarah@example.com",
      avatarUrl: "",
      status: "active",
      tasksCompleted: 18,
    },
    {
      id: "3",
      name: "Michael Chen",
      role: "Frontend Developer",
      email: "michael@example.com",
      avatarUrl: "",
      status: "active",
      tasksCompleted: 32,
    },
    {
      id: "4",
      name: "Emily Davis",
      role: "Backend Developer",
      email: "emily@example.com",
      avatarUrl: "",
      status: "inactive",
      tasksCompleted: 15,
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Team"
        description="Manage your team members and their access"
        icon={<Icons.users className="h-6 w-6" />}
        action={{
          label: "Add Team Member",
          onClick: () => {},
          icon: <Icons.add className="mr-2 h-4 w-4" />,
        }}
      />
      
      <div className="mt-6 space-y-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{member.name}</h3>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                  <p className="text-sm">{member.email}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm">Tasks Completed</p>
                  <p className="text-xl font-semibold">{member.tasksCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;
