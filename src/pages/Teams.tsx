
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "@/hooks/use-search";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Team interface
interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  companyId: string;
  companyName: string;
  createdAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

// Form schema for team creation and editing
const teamFormSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
  companyId: z.string().min(1, "Company is required"),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

const Teams: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { searchQuery, setSearchQuery, filteredItems } = useSearch(teams, ['name', 'description', 'companyName']);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
      companyId: "",
    },
  });

  const editForm = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
      companyId: "",
    },
  });

  useEffect(() => {
    fetchTeams();
    fetchCompanies();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For now, using mock data
      const mockTeams: Team[] = [
        {
          id: "1",
          name: "Development Team",
          description: "Frontend and backend developers",
          members: [
            { id: "1", name: "John Doe", role: "Team Lead", email: "john@example.com" },
            { id: "2", name: "Jane Smith", role: "Frontend Developer", email: "jane@example.com" },
          ],
          companyId: "1",
          companyName: "Acme Inc",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Design Team",
          description: "UI/UX designers",
          members: [
            { id: "3", name: "Emily Davis", role: "Design Lead", email: "emily@example.com" },
          ],
          companyId: "1",
          companyName: "Acme Inc",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Marketing Team",
          description: "Marketing and sales professionals",
          members: [
            { id: "4", name: "Michael Brown", role: "Marketing Manager", email: "michael@example.com" },
            { id: "5", name: "Sarah Johnson", role: "Sales Executive", email: "sarah@example.com" },
          ],
          companyId: "2",
          companyName: "TechCorp",
          createdAt: new Date().toISOString(),
        },
      ];
      
      setTeams(mockTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      // In a real app, this would fetch from Supabase
      // For now, using mock data
      const mockCompanies = [
        { id: "1", name: "Acme Inc" },
        { id: "2", name: "TechCorp" },
        { id: "3", name: "Global Solutions" },
      ];
      
      setCompanies(mockCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Error",
        description: "Failed to load companies",
        variant: "destructive",
      });
    }
  };

  const handleCreateTeam = (data: TeamFormValues) => {
    // Find company name for the selected companyId
    const company = companies.find(c => c.id === data.companyId);
    
    const newTeam: Team = {
      id: `${Date.now()}`,
      name: data.name,
      description: data.description || "",
      members: [],
      companyId: data.companyId,
      companyName: company?.name || "Unknown Company",
      createdAt: new Date().toISOString(),
    };

    setTeams([...teams, newTeam]);
    form.reset();
    setIsCreateDialogOpen(false);
    toast({
      title: "Team created",
      description: `${data.name} team has been created successfully.`,
    });
  };

  const handleEditTeam = (data: TeamFormValues) => {
    if (!selectedTeam) return;

    // Find company name for the selected companyId
    const company = companies.find(c => c.id === data.companyId);
    
    const updatedTeams = teams.map((team) => 
      team.id === selectedTeam.id 
        ? { 
            ...team, 
            name: data.name, 
            description: data.description || "", 
            companyId: data.companyId,
            companyName: company?.name || "Unknown Company" 
          } 
        : team
    );
    
    setTeams(updatedTeams);
    editForm.reset();
    setIsEditDialogOpen(false);
    toast({
      title: "Team updated",
      description: `${data.name} team has been updated successfully.`,
    });
  };

  const handleDeleteTeam = () => {
    if (!selectedTeam) return;
    
    const updatedTeams = teams.filter((team) => team.id !== selectedTeam.id);
    setTeams(updatedTeams);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Team deleted",
      description: `${selectedTeam.name} team has been deleted.`,
      variant: "destructive",
    });
  };

  const openEditDialog = (team: Team) => {
    setSelectedTeam(team);
    editForm.reset({
      name: team.name,
      description: team.description,
      companyId: team.companyId,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteDialogOpen(true);
  };

  const viewTeamDetails = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title="Teams"
        description="Manage your organization teams"
        icon={<Icons.users className="h-6 w-6" />}
        action={{
          label: "Create Team",
          onClick: () => setIsCreateDialogOpen(true),
          icon: <Icons.userPlus className="mr-2 h-4 w-4" />,
        }}
      />

      <div className="my-6">
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredItems.map((team: Team) => (
          <Card key={team.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg truncate" title={team.name}>
                  {team.name}
                </CardTitle>
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(team)}
                  >
                    <Icons.edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(team)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="text-sm font-medium">{team.companyName}</p>
                </div>
                {team.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{team.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Members ({team.members.length})</p>
                  <div className="flex -space-x-2 mt-1 overflow-hidden">
                    {team.members.length > 0 ? (
                      team.members.slice(0, 3).map((member, index) => (
                        <Avatar key={index} className="border-2 border-background">
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No members yet</p>
                    )}
                    {team.members.length > 3 && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-xs">
                        +{team.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => viewTeamDetails(team.id)}
                >
                  <Icons.view className="mr-2 h-4 w-4" />
                  View Team
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12 bg-card rounded-md shadow-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <Icons.users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No teams found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "No teams match your search criteria." 
                : "You haven't created any teams yet."}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Icons.userPlus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </div>
        )}
      </div>

      {/* Create Team Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              Create a new team and assign it to a company
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateTeam)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
              
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Team</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update team information
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditTeam)} className="space-y-4">
              <FormField
                control={editForm.control}
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
                control={editForm.control}
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
              
              <FormField
                control={editForm.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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

      {/* Delete Team Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              onClick={() => setIsDeleteDialogOpen(false)}
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
    </div>
  );
};

export default Teams;
