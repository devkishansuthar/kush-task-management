
import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#3b82f6" />
                <Line type="monotone" dataKey="total" stroke="#9ca3af" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tasksByPriorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
