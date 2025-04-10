
import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const TodoLists: React.FC = () => {
  // Mock todo data
  const initialTodos = {
    personal: [
      { id: "p1", title: "Complete project plan", completed: false },
      { id: "p2", title: "Schedule meeting with team", completed: true },
      { id: "p3", title: "Review latest design changes", completed: false },
      { id: "p4", title: "Update documentation", completed: false },
    ],
    team: [
      { id: "t1", title: "Deploy application to staging", completed: false },
      { id: "t2", title: "Fix navigation bar issues", completed: true },
      { id: "t3", title: "Implement authentication flow", completed: true },
      { id: "t4", title: "Review pull requests", completed: false },
    ]
  };
  
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  
  const toggleTodoStatus = (todoId: string) => {
    setTodos({
      ...todos,
      [activeTab]: todos[activeTab as keyof typeof todos].map(todo => 
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };
  
  const addNewTodo = () => {
    if (newTodo.trim() === "") return;
    
    setTodos({
      ...todos,
      [activeTab]: [
        { id: `${activeTab[0]}-${Date.now()}`, title: newTodo, completed: false },
        ...todos[activeTab as keyof typeof todos]
      ]
    });
    
    setNewTodo("");
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="To-Do Lists"
        description="Manage your personal and team tasks"
        icon={<Icons.todos className="h-6 w-6" />}
      />
      
      <Tabs defaultValue="personal" className="mt-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[200px]">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2 mt-4 mb-4">
          <input
            type="text"
            placeholder="Add a new todo item..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNewTodo()}
          />
          <Button onClick={addNewTodo}>Add</Button>
        </div>
        
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal To-Dos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todos.personal.map(todo => (
                  <div key={todo.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={todo.id} 
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodoStatus(todo.id)}
                    />
                    <label
                      htmlFor={todo.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        todo.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {todo.title}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team To-Dos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todos.team.map(todo => (
                  <div key={todo.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={todo.id} 
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodoStatus(todo.id)}
                    />
                    <label
                      htmlFor={todo.id}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        todo.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {todo.title}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TodoLists;
