
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Team, TeamMember } from "@/types/team";

interface TeamMemberFormValues {
  name: string;
  role: string;
  email: string;
}

const teamMemberFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address"),
});

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const addForm = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
    }
  });

  const editForm = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
    }
  });

  useEffect(() => {
    if (id) {
      fetchTeamDetails();
    }
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch team details with company name
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`
          *,
          companies(name)
        `)
        .eq('id', id)
        .single();
      
      if (teamError) throw teamError;
      
      if (teamData) {
        setTeam({
          id: teamData.id,
          name: teamData.name,
          description: teamData.description || "",
          companyId: teamData.company_id,
          companyName: teamData.companies?.name || "Unknown Company",
          members: [],
          createdAt: teamData.created_at
        });
        
        // Fetch team members
        const { data: membersData, error: membersError } = await supabase
          .from('team_members')
          .select('*')
          .eq('team_id', id);
        
        if (membersError) throw membersError;
        
        const formattedMembers = (membersData || []).map(member => ({
          id: member.id,
          name: member.name,
          role: member.role || "",
          email: member.email || "",
          avatar: member.avatar
        }));
        
        setMembers(formattedMembers);
      }
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

  const handleAddMember = async (data: TeamMemberFormValues) => {
    if (!id) return;
    
    try {
      const { data: newMember, error } = await supabase
        .from('team_members')
        .insert({
          name: data.name,
          role: data.role,
          email: data.email,
          team_id: id,
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
      
      setMembers([...members, addedMember]);
      addForm.reset();
      setIsAddDialogOpen(false);
      
      toast({
        title: "Team member added",
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
      
      const updatedMembers = members.map((member) => 
        member.id === selectedMember.id ? 
          { ...member, name: data.name, role: data.role, email: data.email } : 
          member
      );
      
      setMembers(updatedMembers);
      editForm.reset();
      setIsEditDialogOpen(false);
      
      toast({
        title: "Team member updated",
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
      
      const updatedMembers = members.filter((member) => member.id !== selectedMember.id);
      setMembers(updatedMembers);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Team member removed",
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

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    editForm.reset({
      name: member.name,
      role: member.role,
      email: member.email,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const filteredMembers = members.filter(member => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });

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
        description={team.description || `Team at ${team.companyName}`}
        icon={<Icons.users className="h-6 w-6" />}
        action={{
          label: "Add Team Member",
          onClick: () => setIsAddDialogOpen(true),
          icon: <Icons.userPlus className="mr-2 h-4 w-4" />,
        }}
      />

      <Card className="mt-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Team Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">{team.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{new Date(team.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {team.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{team.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-bold">Team Members</h2>
        <Input 
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-md shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Icons.users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">
            {searchQuery 
              ? "No team members match your search" 
              : "No team members found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? "Try adjusting your search query" 
              : "This team doesn't have any members yet."}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Icons.userPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(name => name[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate" title={member.name}>
                      {member.name}
                    </h3>
                    <Badge className="mt-1">{member.role}</Badge>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Icons.mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{member.email}</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(member)}
                  >
                    <Icons.edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => openDeleteDialog(member)}
                  >
                    <Icons.trash className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddMember)} className="space-y-4">
              <FormField
                control={addForm.control}
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
                control={addForm.control}
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
                control={addForm.control}
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditMember)} className="space-y-4">
              <FormField
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
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
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              onClick={() => setIsDeleteDialogOpen(false)}
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

export default TeamDetails;
