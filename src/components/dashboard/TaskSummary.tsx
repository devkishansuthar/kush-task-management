
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Link } from "react-router-dom";

interface TaskData {
  name: string;
  value: number;
  color: string;
}

interface TaskSummaryProps {
  data: TaskData[];
  total: number;
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ data, total }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Task Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} tasks`, name]}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <div>
                <span className="font-medium">{item.name}</span>:{" "}
                <span className="text-muted-foreground">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Total Tasks: <span className="font-medium text-foreground">{total}</span>
        </div>
        <Button variant="link" asChild>
          <Link to="/tasks">View all tasks</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskSummary;
