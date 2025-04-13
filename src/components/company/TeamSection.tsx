
import React, { useState, useEffect } from "react";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Team, TeamMember } from "@/types/team";
import { mapDbTeamToTeam, mapDbTeamMemberToTeamMember } from "@/utils/supabaseAdapters";
import { useNavigate } from "react-router-dom";

interface TeamSectionProps {
  companyId: string;
  companyName: string;
}

// Form schema for team creation
const teamFormSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

const TeamSection: React.FC<TeamSectionProps> = ({ companyId, companyName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (companyId) {
      fetchTeams();
    }
  }, [companyId]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;

      // Fetch team members for each team
      const teamsWithMembers = await Promise.all(
        (teamsData || []).map(async (team) => {
          const { data: membersData } = await supabase
            .from('team_members')
            .select('*')
            .eq('team_id', team.id);

          return mapDbTeamToTeam({
            ...team,
            company_name: companyName
          }, (membersData || []).map(mapDbTeamMemberToTeamMember));
        })
      );

      setTeams(teamsWithMembers);
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

  const handleCreateTeam = async (data: TeamFormValues) => {
    try {
      const { data: newTeam, error } = await supabase
        .from('teams')
        .insert({
          name: data.name,
          description: data.description,
          company_id: companyId
        })
        .select()
        .single();

      if (error) throw error;

      const createdTeam = mapDbTeamToTeam({
        ...newTeam,
        company_name: companyName
      }, []);

      setTeams([...teams, createdTeam]);
      form.reset();
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Team created",
        description: `${data.name} team has been created successfully.`,
      });
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team",
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

      const updatedTeams = teams.filter(team => team.id !== selectedTeam.id);
      setTeams(updatedTeams);
      setIsDeleteDialogOpen(false);
      
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

  const openDeleteDialog = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteDialogOpen(true);
  };

  const viewTeamDetails = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Teams</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Icons.users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Teams</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This company doesn't have any teams yet
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              size="sm"
            >
              <Icons.plus className="mr-2 h-4 w-4" />
              Create First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(team)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                            {member.avatar ? (
                              <AvatarImage src={member.avatar} alt={member.name} />
                            ) : (
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            )}
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
                    <Icons.users className="mr-2 h-4 w-4" />
                    Manage Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Team Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team</DialogTitle>
            <DialogDescription>
              Create a new team for {companyName}
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

export default TeamSection;
