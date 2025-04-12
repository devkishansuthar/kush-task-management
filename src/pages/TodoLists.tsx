
import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  type: "personal" | "team";
}

const TodoLists: React.FC = () => {
  const [todos, setTodos] = useState<{personal: TodoItem[], team: TodoItem[]}>({
    personal: [],
    team: []
  });
  const [newTodo, setNewTodo] = useState("");
  const [activeTab, setActiveTab] = useState<"personal" | "team">("personal");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch todos from Supabase
  useEffect(() => {
    fetchTodos();
  }, []);
  
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      
      // For now, we'll use the content field to store the title 
      // and add a "personal-" or "team-" prefix to identify the type
      const { data, error } = await supabase
        .from('todos')
        .select('*');
      
      if (error) throw error;
      
      // Process the data
      const personalTodos: TodoItem[] = [];
      const teamTodos: TodoItem[] = [];
      
      data?.forEach(todo => {
        const content = todo.content;
        if (content.startsWith("personal-")) {
          personalTodos.push({
            id: todo.id,
            title: content.replace("personal-", ""),
            completed: !!todo.completed,
            type: "personal"
          });
        } else if (content.startsWith("team-")) {
          teamTodos.push({
            id: todo.id,
            title: content.replace("team-", ""),
            completed: !!todo.completed,
            type: "team"
          });
        }
      });
      
      setTodos({
        personal: personalTodos,
        team: teamTodos
      });
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast({
        title: "Error",
        description: "Failed to load todo items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTodoStatus = async (todoId: string) => {
    try {
      // Find the todo in our state
      const todoType = todos.personal.find(t => t.id === todoId) ? "personal" : "team";
      const todo = todos[todoType].find(t => t.id === todoId);
      
      if (!todo) return;
      
      const newStatus = !todo.completed;
      
      // Update in Supabase
      const { error } = await supabase
        .from('todos')
        .update({ completed: newStatus })
        .eq('id', todoId);
      
      if (error) throw error;
      
      // Update local state
      setTodos({
        ...todos,
        [todoType]: todos[todoType].map(t => 
          t.id === todoId ? { ...t, completed: newStatus } : t
        )
      });
    } catch (error) {
      console.error("Error toggling todo status:", error);
      toast({
        title: "Error",
        description: "Failed to update todo status",
        variant: "destructive"
      });
    }
  };
  
  const addNewTodo = async () => {
    if (newTodo.trim() === "") return;
    
    try {
      // Create in Supabase with prefix to identify type
      const content = `${activeTab}-${newTodo}`;
      
      const { data, error } = await supabase
        .from('todos')
        .insert({ content, completed: false })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Add to local state
        const newTodoItem: TodoItem = {
          id: data[0].id,
          title: newTodo,
          completed: false,
          type: activeTab
        };
        
        setTodos({
          ...todos,
          [activeTab]: [newTodoItem, ...todos[activeTab]]
        });
        
        setNewTodo("");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: "Failed to add todo item",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="To-Do Lists"
        description="Manage your personal and team tasks"
        icon={<Icons.todos className="h-6 w-6" />}
      />
      
      <Tabs defaultValue="personal" className="mt-6" onValueChange={(value) => setActiveTab(value as "personal" | "team")}>
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
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Icons.spinner className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {todos.personal.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No todo items yet</p>
                  ) : (
                    todos.personal.map(todo => (
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
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team To-Dos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Icons.spinner className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {todos.team.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No todo items yet</p>
                  ) : (
                    todos.team.map(todo => (
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
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TodoLists;
