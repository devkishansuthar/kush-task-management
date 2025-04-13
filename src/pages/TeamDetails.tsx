
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  companyId: string;
  companyName: string;
  createdAt: string;
}

// Form schema for member creation and editing
const memberFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  const addMemberForm = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      status: "active",
    },
  });

  const editMemberForm = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (id) {
      fetchTeamDetails();
    }
  }, [id]);
  
  const fetchTeamDetails = async () => {
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
            { id: "1", name: "John Doe", role: "Team Lead", email: "john@example.com", status: "active" },
            { id: "2", name: "Jane Smith", role: "Frontend Developer", email: "jane@example.com", status: "active" },
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
            { id: "3", name: "Emily Davis", role: "Design Lead", email: "emily@example.com", status: "active" },
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
            { id: "4", name: "Michael Brown", role: "Marketing Manager", email: "michael@example.com", status: "active" },
            { id: "5", name: "Sarah Johnson", role: "Sales Executive", email: "sarah@example.com", status: "inactive" },
          ],
          companyId: "2",
          companyName: "TechCorp",
          createdAt: new Date().toISOString(),
        },
      ];
      
      const foundTeam = mockTeams.find(t => t.id === id);
      setTeam(foundTeam || null);
    } catch (error) {
      console.error("Error fetching team details:", error);
      toast({
        title: "Error",
        description: "Failed to load team details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = (data: MemberFormValues) => {
    if (!team) return;
    
    const newMember: TeamMember = {
      id: `${Date.now()}`,
      name: data.name,
      role: data.role,
      email: data.email,
      status: data.status,
    };
    
    const updatedTeam = {
      ...team,
      members: [...team.members, newMember],
    };
    
    setTeam(updatedTeam);
    addMemberForm.reset();
    setIsAddMemberDialogOpen(false);
    toast({
      title: "Team member added",
      description: `${data.name} has been added to the team.`,
    });
  };

  const handleEditMember = (data: MemberFormValues) => {
    if (!team || !selectedMember) return;
    
    const updatedMembers = team.members.map((member) => 
      member.id === selectedMember.id 
        ? { 
            ...member, 
            name: data.name,
            role: data.role,
            email: data.email,
            status: data.status,
          } 
        : member
    );
    
    const updatedTeam = {
      ...team,
      members: updatedMembers,
    };
    
    setTeam(updatedTeam);
    editMemberForm.reset();
    setIsEditMemberDialogOpen(false);
    toast({
      title: "Team member updated",
      description: `${data.name}'s information has been updated.`,
    });
  };

  const handleRemoveMember = () => {
    if (!team || !selectedMember) return;
    
    const updatedMembers = team.members.filter((member) => member.id !== selectedMember.id);
    
    const updatedTeam = {
      ...team,
      members: updatedMembers,
    };
    
    setTeam(updatedTeam);
    setIsRemoveMemberDialogOpen(false);
    toast({
      title: "Team member removed",
      description: `${selectedMember.name} has been removed from the team.`,
      variant: "destructive",
    });
  };

  const openEditMemberDialog = (member: TeamMember) => {
    setSelectedMember(member);
    editMemberForm.reset({
      name: member.name,
      role: member.role,
      email: member.email,
      status: member.status,
    });
    setIsEditMemberDialogOpen(true);
  };

  const openRemoveMemberDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsRemoveMemberDialogOpen(true);
  };

  const filteredMembers = team?.members.filter((member) => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
        <p className="mb-6">The team you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/teams")}>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4">
      <PageHeader
        title={team.name}
        description={team.description || "Team details and members"}
        icon={<Icons.users className="h-6 w-6" />}
        action={{
          label: "Add Member",
          onClick: () => setIsAddMemberDialogOpen(true),
          icon: <Icons.userPlus className="mr-2 h-4 w-4" />,
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Team Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
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
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-sm font-medium">{team.members.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{new Date(team.createdAt).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => navigate("/teams")}>
                  <Icons.chevronLeft className="mr-2 h-4 w-4" />
                  Back to Teams
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="members">
            <TabsList className="mb-4">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="members">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Team Members</CardTitle>
                    <Input
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredMembers.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                        <Icons.users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No members found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery 
                          ? "No members match your search criteria." 
                          : "This team doesn't have any members yet."}
                      </p>
                      <Button onClick={() => setIsAddMemberDialogOpen(true)}>
                        <Icons.userPlus className="mr-2 h-4 w-4" />
                        Add Member
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {member.name.split(' ').map(name => name[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                <span className="text-muted-foreground">•</span>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={member.status === "active" ? "default" : "secondary"}>
                              {member.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditMemberDialog(member)}
                            >
                              <Icons.edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRemoveMemberDialog(member)}
                            >
                              <Icons.userMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                      <Icons.tasks className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No tasks assigned</h3>
                    <p className="text-muted-foreground mb-4">
                      This team doesn't have any tasks assigned yet.
                    </p>
                    <Button onClick={() => navigate("/tasks/new")}>
                      <Icons.add className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
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
                              {["John Doe", "Jane Smith", "Emily Davis"][i]}
                            </span>{" "}
                            {[
                              "was added to the team",
                              "updated their profile",
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
      
      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to {team.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...addMemberForm}>
            <form onSubmit={addMemberForm.handleSubmit(handleAddMember)} className="space-y-4">
              <FormField
                control={addMemberForm.control}
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
                control={addMemberForm.control}
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
                control={addMemberForm.control}
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
              <FormField
                control={addMemberForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
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

      {/* Edit Member Dialog */}
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
              <FormField
                control={editMemberForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
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

      {/* Remove Member Dialog */}
      <Dialog open={isRemoveMemberDialogOpen} onOpenChange={setIsRemoveMemberDialogOpen}>
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
              onClick={() => setIsRemoveMemberDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveMember}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamDetails;
