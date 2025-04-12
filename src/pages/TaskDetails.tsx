
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTasks, mockCompanies } from "@/services/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Todo, TaskStatus, TaskPriority } from "@/types/task";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the task by ID
  const task = mockTasks.find(task => task.id === id);
  
  // Find the company
  const company = task?.companyId ? 
    mockCompanies.find(company => company.id === task.companyId) : 
    undefined;
  
  const [newTodo, setNewTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>(task?.todos || []);
  
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
  
  // Get status badge variant
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
  
  // Get priority badge variant
  const getPriorityVariant = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "outline";
      case "medium":
        return "secondary";
      case "high":
        return "warning";
      case "urgent":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const newTodoItem: Todo = {
      id: `todo-${Date.now()}`,
      content: newTodo,
      completed: false,
      taskId: task.id,
      createdAt: new Date().toISOString(),
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };
  
  const toggleTodo = (todoId: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title={task.title}
        description={`Task created on ${new Date(task.createdAt).toLocaleDateString()}`}
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
                  <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                  <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.clock className="mr-1 h-4 w-4" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
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
                              onCheckedChange={() => toggleTodo(todo.id)} 
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
                  {task.comments.length === 0 ? (
                    <div className="text-center py-6 bg-muted/40 rounded-md">
                      <p className="text-sm text-muted-foreground">No comments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {task.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 border rounded-md">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback className="text-xs">
                              {comment.user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm">{comment.user.name}</p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex gap-2">
                    <Textarea placeholder="Add a comment..." className="flex-1" />
                    <Button>Post</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments">
                  {task.attachments.length === 0 ? (
                    <div className="text-center py-6 bg-muted/40 rounded-md">
                      <p className="text-sm text-muted-foreground">No attachments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {task.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Icons.fileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(attachment.size / 1024)} KB • Uploaded by {attachment.uploadedBy.name}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Icons.download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Reporter</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.reporter.avatar} alt={task.reporter.name} />
                        <AvatarFallback className="text-xs">
                          {task.reporter.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.reporter.name}</span>
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
                    <p className="text-sm">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</p>
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
