
import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";

const Analytics: React.FC = () => {
  // Mock data for charts
  const taskCompletionData = [
    { name: 'Mon', completed: 4, total: 6 },
    { name: 'Tue', completed: 3, total: 5 },
    { name: 'Wed', completed: 7, total: 10 },
    { name: 'Thu', completed: 5, total: 8 },
    { name: 'Fri', completed: 6, total: 7 },
    { name: 'Sat', completed: 2, total: 3 },
    { name: 'Sun', completed: 1, total: 2 },
  ];
  
  const tasksByPriorityData = [
    { name: 'High', count: 12 },
    { name: 'Medium', count: 18 },
    { name: 'Low', count: 8 },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Analytics"
        description="Track your team's performance and productivity"
        icon={<Icons.chart className="h-6 w-6 mr-2" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={taskCompletionData}
              categories={['completed', 'total']}
              index="name"
              colors={['blue', 'gray']}
              yAxisWidth={40}
              className="h-72"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={tasksByPriorityData}
              categories={['count']}
              index="name"
              colors={['blue']}
              yAxisWidth={40}
              className="h-72"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
