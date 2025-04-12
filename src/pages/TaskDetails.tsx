
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Todo, TaskStatus, TaskPriority } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { mapDbTodoToTodo } from "@/utils/supabaseAdapters";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [task, setTask] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);
  
  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch task details
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (taskError) throw taskError;
      
      if (taskData) {
        setTask(taskData);
        
        // Fetch todos for this task
        const { data: todosData, error: todosError } = await supabase
          .from('todos')
          .select('*')
          .eq('task_id', id);
        
        if (todosError) throw todosError;
        
        if (todosData) {
          // Map the database todo objects to the Todo interface
          const mappedTodos: Todo[] = todosData.map((todo) => mapDbTodoToTodo(todo));
          setTodos(mappedTodos);
        }
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast({
        title: "Error",
        description: "Failed to load task details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          { 
            content: newTodo, 
            task_id: id,
            completed: false 
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newMappedTodo = mapDbTodoToTodo(data[0]);
        setTodos([...todos, newMappedTodo]);
        setNewTodo("");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: "Failed to add todo item",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', todoId);
      
      if (error) throw error;
      
      setTodos(todos.map(todo => 
        todo.id === todoId ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo item",
        variant: "destructive",
      });
    }
  };
  
  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
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
  
  const getPriorityVariant = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "outline";
      case "medium":
        return "secondary";
      case "high":
        return "default";
      case "urgent":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
        <p className="mb-6">The task you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/tasks")}>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title={task.title}
        description={task.description || "No description provided"}
        icon={<Icons.tasks className="h-6 w-6" />}
        action={{
          label: "Edit Task",
          onClick: () => {},
          icon: <Icons.edit className="mr-2 h-4 w-4" />,
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Todo Items</CardTitle>
            </CardHeader>
            <CardContent>
              {todos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No todo items yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div key={todo.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={todo.id}
                        checked={todo.completed}
                        onCheckedChange={(checked) => 
                          handleToggleTodo(todo.id, checked === true)
                        }
                      />
                      <Label
                        htmlFor={todo.id}
                        className={`flex-1 ${
                          todo.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {todo.content}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleAddTodo} className="flex space-x-2 mt-6">
                <Input
                  placeholder="Add a new todo item"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Icons.add className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusVariant(task.status as TaskStatus)} className="mt-1">
                    {task.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant={getPriorityVariant(task.priority as TaskPriority)} className="mt-1">
                    {task.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="text-sm font-medium">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assignee</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icons.user className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {task.assignee_name || "Unassigned"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  {task.company_id ? (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm font-medium"
                      onClick={() => navigate(`/companies/${task.company_id}`)}
                    >
                      View Company
                    </Button>
                  ) : (
                    <p className="text-sm font-medium">Not assigned</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
