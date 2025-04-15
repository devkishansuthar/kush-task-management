
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import TaskSummary from "@/components/dashboard/TaskSummary";
import { Icons } from "@/components/shared/Icons";
import { getTaskSummaryData, mockActivities, mockTasks } from "@/services/mockData";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Get tasks for the current user's company
  const tasks = profile?.companyId 
    ? mockTasks.filter(task => task.companyId === profile.companyId)
    : mockTasks;
  
  // Calculate task statistics
  const todoCount = tasks.filter(task => task.status === "todo").length;
  const inProgressCount = tasks.filter(task => task.status === "in progress").length;
  const completedCount = tasks.filter(task => task.status === "completed").length;
  
  // Get task summary data for charts
  const taskSummary = getTaskSummaryData(profile?.role !== "superadmin" ? profile?.companyId : undefined);
  
  // Select role-appropriate greeting
  const getRoleSpecificContent = () => {
    switch (profile?.role) {
      case "superadmin":
        return {
          title: "SuperAdmin Dashboard",
          description: "Platform-wide overview and management",
          stats: [
            {
              title: "Total Companies",
              value: "3",
              icon: <Icons.users className="h-4 w-4" />,
              trend: { value: 15, isPositive: true },
            },
          ],
        };
      case "admin":
        return {
          title: `${profile.companyName} Dashboard`,
          description: "Monitor your team's performance and tasks",
          stats: [
            {
              title: "Team Members",
              value: "8",
              icon: <Icons.users className="h-4 w-4" />,
              trend: { value: 5, isPositive: true },
            },
          ],
        };
      default:
        return {
          title: "My Dashboard",
          description: "Track your tasks and productivity",
          stats: [
            {
              title: "My Tasks",
              value: tasks.filter(task => task.assignee.id === profile?.id).length.toString(),
              icon: <Icons.tasks className="h-4 w-4" />,
            },
          ],
        };
    }
  };
  
  const roleContent = getRoleSpecificContent();

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title={roleContent.title}
        description={roleContent.description}
        action={{
          label: "Create Task",
          onClick: () => navigate("/tasks/new"),
          icon: <Icons.add className="mr-2 h-4 w-4" />,
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Common stats for all roles */}
        <StatCard
          title="To Do"
          value={todoCount}
          icon={<Icons.tasks className="h-4 w-4" />}
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          icon={<Icons.clock className="h-4 w-4" />}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          icon={<Icons.completed className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        
        {/* Role-specific stats */}
        {roleContent.stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            <div className="space-y-4">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="task-card cursor-pointer"
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <div
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : task.status === "in progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {task.status}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <div>Due: {task.dueDate}</div>
                    <div>Assignee: {task.assignee.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <a href="/tasks">View All Tasks</a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <ActivityFeed activities={mockActivities} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TaskSummary
          data={taskSummary.statusData}
          total={taskSummary.total}
        />
        <TaskSummary
          data={taskSummary.priorityData}
          total={taskSummary.total}
        />
      </div>
    </div>
  );
};

export default Dashboard;
