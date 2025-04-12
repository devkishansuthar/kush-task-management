
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Todo, TaskStatus, TaskPriority } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [task, setTask] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  
  useEffect(() => {
    if (id) {
      fetchTaskData();
    }
  }, [id]);
  
  const fetchTaskData = async () => {
    try {
      setLoading(true);
      
      // Fetch task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (taskError) throw taskError;
      
      if (taskData) {
        setTask(taskData);
        
        // Fetch company if task has company_id
        if (taskData.company_id) {
          const { data: companyData } = await supabase
            .from('companies')
            .select('*')
            .eq('id', taskData.company_id)
            .single();
          
          if (companyData) {
            setCompany(companyData);
          }
        }
        
        // Fetch todos
        const { data: todosData } = await supabase
          .from('todos')
          .select('*')
          .eq('task_id', id);
        
        if (todosData) {
          setTodos(todosData);
        }
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
      toast({
        title: "Error",
        description: "Failed to load task data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      const newTodoItem = {
        content: newTodo,
        task_id: task.id,
        completed: false
      };
      
      const { data, error } = await supabase
        .from('todos')
        .insert(newTodoItem)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTodos([...todos, data[0]]);
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
  
  const toggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', todoId);
      
      if (error) throw error;
      
      setTodos(
        todos.map(todo => 
          todo.id === todoId ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo item",
        variant: "destructive",
      });
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

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title={task.title}
        description={`Task created on ${new Date(task.created_at).toLocaleDateString()}`}
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
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <div className="flex gap-2">
                  <Badge variant={getStatusVariant(task.status as TaskStatus)}>{task.status}</Badge>
                  <Badge variant={getPriorityVariant(task.priority as TaskPriority)}>{task.priority}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.clock className="mr-1 h-4 w-4" />
                  Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                </div>
              </div>
              <CardDescription className="mt-4">{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="todos">
                <TabsList className="mb-4">
                  <TabsTrigger value="todos">To-Do List</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="todos">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Add a new to-do item..." 
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addTodo}>Add</Button>
                    </div>
                    
                    {todos.length === 0 ? (
                      <div className="text-center py-6 bg-muted/40 rounded-md">
                        <p className="text-sm text-muted-foreground">No to-do items yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {todos.map((todo) => (
                          <div key={todo.id} className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md">
                            <Checkbox 
                              checked={todo.completed} 
                              onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                              id={todo.id}
                            />
                            <label 
                              htmlFor={todo.id} 
                              className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {todo.content}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="comments">
                  <div className="text-center py-6 bg-muted/40 rounded-md">
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Textarea placeholder="Add a comment..." className="flex-1" />
                    <Button>Post</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments">
                  <div className="text-center py-6 bg-muted/40 rounded-md">
                    <p className="text-sm text-muted-foreground">No attachments yet</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Assignee</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          UN
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Unassigned</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Reporter</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          UN
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">System</span>
                    </div>
                  </div>
                  
                  {company && (
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                          <Icons.building className="w-3 h-3 text-primary" />
                        </div>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm"
                          onClick={() => navigate(`/companies/${company.id}`)}
                        >
                          {company.name}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(task.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="text-sm">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.user className="mr-2 h-4 w-4" />
                    Reassign
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.tag className="mr-2 h-4 w-4" />
                    Add Label
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
