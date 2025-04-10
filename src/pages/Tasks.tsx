
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/shared/PageHeader";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFilters from "@/components/tasks/TaskFilters";
import { Icons } from "@/components/shared/Icons";
import { mockTasks } from "@/services/mockData";
import { Task } from "@/types/task";

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get tasks for the current user based on role
  const getFilteredTasks = () => {
    if (user?.role === "superadmin") {
      return mockTasks;
    } else if (user?.companyId) {
      return mockTasks.filter(task => task.companyId === user.companyId);
    }
    return [];
  };
  
  const [tasks, setTasks] = useState<Task[]>(getFilteredTasks());
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    assignee: "all",
  });
  
  // Handle search
  const handleSearch = (term: string) => {
    setFilters({ ...filters, search: term });
    applyFilters({ ...filters, search: term });
  };
  
  // Handle filter change
  const handleFilterChange = (filter: string, value: string) => {
    const newFilters = { ...filters, [filter]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };
  
  // Apply all filters
  const applyFilters = (currentFilters: typeof filters) => {
    let filteredTasks = getFilteredTasks();
    
    // Apply search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        task => 
          task.title.toLowerCase().includes(searchTerm) || 
          task.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (currentFilters.status !== "all") {
      filteredTasks = filteredTasks.filter(
        task => task.status === currentFilters.status
      );
    }
    
    // Apply priority filter
    if (currentFilters.priority !== "all") {
      filteredTasks = filteredTasks.filter(
        task => task.priority === currentFilters.priority
      );
    }
    
    // Apply assignee filter
    if (currentFilters.assignee === "me") {
      filteredTasks = filteredTasks.filter(
        task => task.assignee.id === user?.id
      );
    } else if (currentFilters.assignee === "unassigned") {
      filteredTasks = filteredTasks.filter(
        task => !task.assignee.id
      );
    }
    
    setTasks(filteredTasks);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
      assignee: "all",
    });
    setTasks(getFilteredTasks());
  };

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Tasks"
        description="Manage and track all tasks"
        action={{
          label: "Create Task",
          onClick: () => navigate("/tasks/new"),
          icon: <Icons.add className="mr-2 h-4 w-4" />,
        }}
      />
      
      <TaskFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Icons.tasks className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {filters.search || filters.status !== "all" || filters.priority !== "all" || filters.assignee !== "all"
              ? "Try adjusting your filters to find what you're looking for."
              : "Get started by creating your first task."}
          </p>
          <Button onClick={() => navigate("/tasks/new")}>
            <Icons.add className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              dueDate={task.dueDate}
              assignee={task.assignee}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
