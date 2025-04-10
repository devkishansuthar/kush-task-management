
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/Icons";
import { TaskPriority } from "@/types/task";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: TaskPriority;
  dueDate: string;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  assignee,
  className,
}) => {
  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "bg-priority-low";
      case "medium":
        return "bg-priority-medium";
      case "high":
        return "bg-priority-high";
      case "urgent":
        return "bg-priority-urgent";
      default:
        return "bg-gray-400";
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "outline";
      case "in progress":
        return "secondary";
      case "todo":
        return "default";
      case "blocked":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className={cn("priority-indicator", getPriorityColor(priority))} />
      <CardContent className="p-4">
        <div className="mb-2 flex justify-between items-start">
          <Badge variant={getStatusVariant(status)}>{status}</Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Icons.clock className="mr-1 h-3 w-3" />
            {dueDate}
          </div>
        </div>
        <Link to={`/tasks/${id}`} className="block hover:underline mb-1">
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback className="text-xs">
              {assignee.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs">{assignee.name}</span>
        </div>
        <div className="flex gap-1">
          <Badge variant="outline" className="capitalize text-xs">
            {priority}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
