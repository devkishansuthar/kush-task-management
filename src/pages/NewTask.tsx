
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const NewTask: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: null as Date | null,
    assignee: "",
  });
  
  const updateTask = (field: string, value: any) => {
    setTask({ ...task, [field]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!task.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    // Success - in a real app, this would save to the database
    toast({
      title: "Success",
      description: "Task created successfully",
    });
    
    // Navigate back to tasks page
    navigate('/tasks');
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Create New Task"
        description="Add a new task to your project"
        icon={<Icons.add className="h-6 w-6 mr-2" />}
      />
      
      <Card className="mt-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={task.title}
                onChange={(e) => updateTask("title", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                rows={4}
                value={task.description}
                onChange={(e) => updateTask("description", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={task.priority} 
                  onValueChange={(value) => updateTask("priority", value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Icons.calendar className="mr-2 h-4 w-4" />
                      {task.dueDate ? format(task.dueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={task.dueDate || undefined}
                      onSelect={(date) => updateTask("dueDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select 
                  value={task.assignee} 
                  onValueChange={(value) => updateTask("assignee", value)}
                >
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Assign to" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Alex Johnson</SelectItem>
                    <SelectItem value="user2">Sarah Williams</SelectItem>
                    <SelectItem value="user3">Michael Chen</SelectItem>
                    <SelectItem value="user4">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate('/tasks')}>
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTask;
