import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import Analytics from "@/pages/Analytics";
import Team from "@/pages/Team";
import Teams from "@/pages/Teams";
import TeamDetails from "@/pages/TeamDetails";
import TodoLists from "@/pages/TodoLists";
import NewTask from "@/pages/NewTask";
import Calendar from "@/pages/Calendar";
import Companies from "@/pages/Companies";
import CompanyDetails from "@/pages/CompanyDetails";
import AddCompany from "@/pages/AddCompany";
import TaskDetails from "@/pages/TaskDetails";
import EditCompany from "@/pages/EditCompany";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<Index />} />
              
              {/* Protected routes */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/new" element={<NewTask />} />
                <Route path="/tasks/:id" element={<TaskDetails />} />
                <Route path="/todos" element={<TodoLists />} />
                <Route path="/team" element={<Navigate to="/teams" replace />} />
                <Route path="/team/:id" element={<Team />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/teams/:id" element={<TeamDetails />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/new" element={<AddCompany />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />
                <Route path="/companies/:id/edit" element={<EditCompany />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
