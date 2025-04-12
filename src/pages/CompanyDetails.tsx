
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskCard from "@/components/tasks/TaskCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { mapDbCompanyToCompany } from "@/utils/supabaseAdapters";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Company } from "@/types/company";
import { Label } from "@/components/ui/label";

interface CompanyFormValues {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  employeeCount: number;
  status: "active" | "inactive" | "suspended";
}

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [companyTasks, setCompanyTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const editForm = useForm<CompanyFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      employeeCount: 0,
      status: "active"
    }
  });

  useEffect(() => {
    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);
  
  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (companyError) throw companyError;
      
      if (companyData) {
        const mappedCompany = mapDbCompanyToCompany(companyData);
        setCompany(mappedCompany);
        
        // Fetch tasks for this company
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('company_id', id);
        
        if (tasksError) throw tasksError;
        
        setCompanyTasks(tasksData || []);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      toast({
        title: "Error",
        description: "Failed to load company details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const openEditDialog = () => {
    if (!company) return;
    
    editForm.reset({
      name: company.name,
      email: company.email || "",
      phone: company.phone || "",
      website: company.website || "",
      address: company.address || "",
      employeeCount: company.employeeCount,
      status: company.status
    });
    
    setIsEditDialogOpen(true);
  };
  
  const handleEditCompany = async (data: CompanyFormValues) => {
    if (!company || !id) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website,
          address: data.address,
          employee_count: data.employeeCount,
          status: data.status
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state with the new values
      setCompany({
        ...company,
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
        address: data.address,
        employeeCount: data.employeeCount,
        status: data.status
      });
      
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Company information updated successfully",
      });
    } catch (error) {
      console.error("Error updating company:", error);
      toast({
        title: "Error",
        description: "Failed to update company information",
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
  
  if (!company) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
        <p className="mb-6">The company you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/companies")}>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title={company.name}
        description={`Company profile and details`}
        icon={<Icons.building className="h-6 w-6" />}
        action={{
          label: "Edit Company",
          onClick: openEditDialog,
          icon: <Icons.edit className="mr-2 h-4 w-4" />,
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Details</CardTitle>
                <Badge
                  variant={
                    company.status === "active"
                      ? "default"
                      : company.status === "inactive"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center py-4">
                  {company.logo ? (
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="w-24 h-24 rounded-md" 
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary/10 rounded-md flex items-center justify-center">
                      <Icons.building className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{company.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{company.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="text-sm font-medium">{company.website || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">{company.address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-sm font-medium">{company.employeeCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{new Date(company.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="tasks">
            <TabsList className="mb-4">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks">
              {companyTasks.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-md shadow-sm">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Icons.tasks className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    This company doesn't have any tasks yet.
                  </p>
                  <Button onClick={() => navigate("/tasks/new")}>
                    <Icons.add className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description || ""}
                      status={task.status}
                      priority={task.priority}
                      dueDate={task.due_date}
                      assignee={{
                        id: task.assignee_id || "",
                        name: "Unassigned",
                        avatar: ""
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {["JD", "SM", "TK"][i]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {["John Doe", "Sarah Miller", "Tom Kim"][i]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {["CEO", "Marketing", "Developer"][i]}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex gap-3 py-2 border-b last:border-b-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <Icons.clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">
                              {["John Doe", "Sarah Miller", "Tom Kim"][i]}
                            </span>{" "}
                            {[
                              "created a new task",
                              "updated company details",
                              "completed a task",
                            ][i]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {[
                              "2 hours ago",
                              "Yesterday",
                              "3 days ago",
                            ][i]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update company information and settings
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCompany)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="company@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Employees</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDetails;
