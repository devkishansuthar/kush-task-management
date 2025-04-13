
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
import { Team, TeamMember } from "@/types/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface CompanyFormValues {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  employeeCount: number;
  status: "active" | "inactive" | "suspended";
}

interface TeamFormValues {
  name: string;
  description: string;
}

interface TeamMemberFormValues {
  name: string;
  role: string;
  email: string;
}

const teamFormSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
});

const teamMemberFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address"),
});

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [companyTasks, setCompanyTasks] = useState<any[]>([]);
  const [companyTeams, setCompanyTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
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

  const teamForm = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });

  const editTeamForm = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });

  const memberForm = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
    }
  });

  const editMemberForm = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
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

        // Fetch teams for this company
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('*')
          .eq('company_id', id);
        
        if (teamsError) throw teamsError;

        const teams = teamsData || [];
        setCompanyTeams(teams.map(team => ({
          id: team.id,
          name: team.name,
          description: team.description || "",
          companyId: team.company_id,
          companyName: mappedCompany.name,
          members: [],
          createdAt: team.created_at
        })));
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

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);
      
      if (error) throw error;
      
      const members = (data || []).map(member => ({
        id: member.id,
        name: member.name,
        role: member.role || "",
        email: member.email || "",
        avatar: member.avatar
      }));
      
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
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

  const handleAddTeam = async (data: TeamFormValues) => {
    if (!id) return;
    
    try {
      const { data: newTeam, error } = await supabase
        .from('teams')
        .insert({
          name: data.name,
          description: data.description,
          company_id: id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const teamWithCompany = {
        id: newTeam.id,
        name: newTeam.name,
        description: newTeam.description || "",
        companyId: newTeam.company_id,
        companyName: company?.name || "",
        members: [],
        createdAt: newTeam.created_at
      };
      
      setCompanyTeams([...companyTeams, teamWithCompany]);
      teamForm.reset();
      setIsAddTeamDialogOpen(false);
      
      toast({
        title: "Team added",
        description: `${data.name} team has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding team:", error);
      toast({
        title: "Error",
        description: "Failed to add team",
        variant: "destructive",
      });
    }
  };

  const handleEditTeam = async (data: TeamFormValues) => {
    if (!selectedTeam) return;
    
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: data.name,
          description: data.description
        })
        .eq('id', selectedTeam.id);
      
      if (error) throw error;
      
      const updatedTeams = companyTeams.map(team => 
        team.id === selectedTeam.id 
          ? { ...team, name: data.name, description: data.description || "" } 
          : team
      );
      
      setCompanyTeams(updatedTeams);
      editTeamForm.reset();
      setIsEditTeamDialogOpen(false);
      
      toast({
        title: "Team updated",
        description: `${data.name} team has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating team:", error);
      toast({
        title: "Error",
        description: "Failed to update team",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;
    
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', selectedTeam.id);
      
      if (error) throw error;
      
      const updatedTeams = companyTeams.filter(team => team.id !== selectedTeam.id);
      setCompanyTeams(updatedTeams);
      setIsDeleteTeamDialogOpen(false);
      
      toast({
        title: "Team deleted",
        description: `${selectedTeam.name} team has been deleted.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async (data: TeamMemberFormValues) => {
    if (!selectedTeam) return;
    
    try {
      const { data: newMember, error } = await supabase
        .from('team_members')
        .insert({
          name: data.name,
          role: data.role,
          email: data.email,
          team_id: selectedTeam.id,
          user_id: Math.random().toString() // Generate random user_id for now
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const addedMember: TeamMember = {
        id: newMember.id,
        name: newMember.name,
        role: newMember.role || "",
        email: newMember.email || "",
        avatar: newMember.avatar
      };
      
      setTeamMembers([...teamMembers, addedMember]);
      memberForm.reset();
      setIsAddMemberDialogOpen(false);
      
      toast({
        title: "Member added",
        description: `${data.name} has been added to the team.`,
      });
    } catch (error) {
      console.error("Error adding team member:", error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = async (data: TeamMemberFormValues) => {
    if (!selectedMember) return;
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          name: data.name,
          role: data.role,
          email: data.email
        })
        .eq('id', selectedMember.id);
      
      if (error) throw error;
      
      const updatedMembers = teamMembers.map(member => 
        member.id === selectedMember.id 
          ? { ...member, name: data.name, role: data.role, email: data.email } 
          : member
      );
      
      setTeamMembers(updatedMembers);
      editMemberForm.reset();
      setIsEditMemberDialogOpen(false);
      
      toast({
        title: "Member updated",
        description: `${data.name}'s information has been updated.`,
      });
    } catch (error) {
      console.error("Error updating team member:", error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', selectedMember.id);
      
      if (error) throw error;
      
      const updatedMembers = teamMembers.filter(member => member.id !== selectedMember.id);
      setTeamMembers(updatedMembers);
      setIsDeleteMemberDialogOpen(false);
      
      toast({
        title: "Member removed",
        description: `${selectedMember.name} has been removed from the team.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  const selectTeam = (team: Team) => {
    setSelectedTeam(team);
    fetchTeamMembers(team.id);
  };

  const openEditTeamDialog = (team: Team) => {
    setSelectedTeam(team);
    editTeamForm.reset({
      name: team.name,
      description: team.description
    });
    setIsEditTeamDialogOpen(true);
  };

  const openEditMemberDialog = (member: TeamMember) => {
    setSelectedMember(member);
    editMemberForm.reset({
      name: member.name,
      role: member.role,
      email: member.email
    });
    setIsEditMemberDialogOpen(true);
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 bg-card p-4 rounded-md border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Teams</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAddTeamDialogOpen(true)}
                    >
                      <Icons.add className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {companyTeams.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-2">
                        <Icons.users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No teams yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {companyTeams.map(team => (
                        <div 
                          key={team.id} 
                          onClick={() => selectTeam(team)}
                          className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${selectedTeam?.id === team.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                        >
                          <div>
                            <p className="font-medium">{team.name}</p>
                            {team.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{team.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditTeamDialog(team);
                              }}
                            >
                              <Icons.edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTeam(team);
                                setIsDeleteTeamDialogOpen(true);
                              }}
                            >
                              <Icons.trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-2 bg-card p-4 rounded-md border">
                  {selectedTeam ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">{selectedTeam.name}</h3>
                          {selectedTeam.description && (
                            <p className="text-sm text-muted-foreground">{selectedTeam.description}</p>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsAddMemberDialogOpen(true)}
                        >
                          <Icons.userPlus className="h-4 w-4 mr-1" />
                          Add Member
                        </Button>
                      </div>
                      
                      {teamMembers.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2">
                            <Icons.users className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h4 className="text-base font-medium mb-1">No team members</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            This team doesn't have any members yet.
                          </p>
                          <Button 
                            variant="outline"
                            onClick={() => setIsAddMemberDialogOpen(true)}
                          >
                            <Icons.userPlus className="mr-2 h-4 w-4" />
                            Add Team Member
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  {member.avatar ? (
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                  ) : (
                                    <AvatarFallback>
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                    {member.email && (
                                      <p className="text-xs text-muted-foreground">{member.email}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditMemberDialog(member)}
                                >
                                  <Icons.edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setIsDeleteMemberDialogOpen(true);
                                  }}
                                >
                                  <Icons.trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                        <Icons.users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No team selected</h3>
                      <p className="text-muted-foreground mb-4">
                        {companyTeams.length > 0 
                          ? "Select a team from the list on the left to view its members." 
                          : "This company doesn't have any teams yet."}
                      </p>
                      {companyTeams.length === 0 && (
                        <Button 
                          variant="outline"
                          onClick={() => setIsAddTeamDialogOpen(true)}
                        >
                          <Icons.users className="mr-2 h-4 w-4" />
                          Create Team
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
      
      {/* Edit Company Dialog */}
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

      {/* Add Team Dialog */}
      <Dialog open={isAddTeamDialogOpen} onOpenChange={setIsAddTeamDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team</DialogTitle>
          </DialogHeader>
          <Form {...teamForm}>
            <form onSubmit={teamForm.handleSubmit(handleAddTeam)} className="space-y-4">
              <FormField
                control={teamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={teamForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Team</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditTeamDialogOpen} onOpenChange={setIsEditTeamDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          <Form {...editTeamForm}>
            <form onSubmit={editTeamForm.handleSubmit(handleEditTeam)} className="space-y-4">
              <FormField
                control={editTeamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editTeamForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Team Dialog */}
      <Dialog open={isDeleteTeamDialogOpen} onOpenChange={setIsDeleteTeamDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-4">
            Are you sure you want to delete the team "{selectedTeam?.name}"? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteTeamDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <Form {...memberForm}>
            <form onSubmit={memberForm.handleSubmit(handleAddMember)} className="space-y-4">
              <FormField
                control={memberForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={memberForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={memberForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Member</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <Form {...editMemberForm}>
            <form onSubmit={editMemberForm.handleSubmit(handleEditMember)} className="space-y-4">
              <FormField
                control={editMemberForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editMemberForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editMemberForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Team Member Dialog */}
      <Dialog open={isDeleteMemberDialogOpen} onOpenChange={setIsDeleteMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-4">
            Are you sure you want to remove {selectedMember?.name} from the team? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteMemberDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMember}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDetails;
