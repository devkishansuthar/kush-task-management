
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/Icons";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  user: {
    name: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: "task" | "todo" | "comment" | "status";
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, className }) => {
  // Function to get icon based on activity type
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "task":
        return <Icons.tasks className="h-4 w-4" />;
      case "todo":
        return <Icons.todos className="h-4 w-4" />;
      case "comment":
        return <Icons.inbox className="h-4 w-4" />;
      case "status":
        return <Icons.tag className="h-4 w-4" />;
      default:
        return <Icons.clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 border-b border-border pb-3 last:border-0 px-4"
            >
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
