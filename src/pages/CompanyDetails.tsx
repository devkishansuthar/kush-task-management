
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCompanies, mockTasks } from "@/services/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskCard from "@/components/tasks/TaskCard";

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the company by ID
  const company = mockCompanies.find(company => company.id === id);
  
  // Get tasks for this company
  const companyTasks = mockTasks.filter(task => task.companyId === id);
  
  if (!company) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
        <p className="mb-6">The company you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/companies")}>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title={company.name}
        description={`Company profile and details`}
        icon={<Icons.building className="h-6 w-6" />}
        action={{
          label: "Edit Company",
          onClick: () => {},
          icon: <Icons.edit className="mr-2 h-4 w-4" />,
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Details</CardTitle>
                <Badge
                  variant={
                    company.status === "active"
                      ? "default"
                      : company.status === "inactive"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center py-4">
                  {company.logo ? (
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="w-24 h-24 rounded-md" 
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary/10 rounded-md flex items-center justify-center">
                      <Icons.building className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{company.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{company.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="text-sm font-medium">{company.website || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">{company.address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-sm font-medium">{company.employeeCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{company.createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="tasks">
            <TabsList className="mb-4">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks">
              {companyTasks.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-md shadow-sm">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Icons.tasks className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    This company doesn't have any tasks yet.
                  </p>
                  <Button onClick={() => navigate("/tasks/new")}>
                    <Icons.add className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      priority={task.priority}
                      dueDate={task.dueDate}
                      assignee={task.assignee}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {["JD", "SM", "TK"][i]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {["John Doe", "Sarah Miller", "Tom Kim"][i]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {["CEO", "Marketing", "Developer"][i]}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex gap-3 py-2 border-b last:border-b-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <Icons.clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">
                              {["John Doe", "Sarah Miller", "Tom Kim"][i]}
                            </span>{" "}
                            {[
                              "created a new task",
                              "updated company details",
                              "completed a task",
                            ][i]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {[
                              "2 hours ago",
                              "Yesterday",
                              "3 days ago",
                            ][i]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
