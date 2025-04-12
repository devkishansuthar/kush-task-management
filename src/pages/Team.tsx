import React, { useState, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Icons } from "@/components/shared/Icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
  status: string;
  tasksCompleted: number;
}

interface TeamMemberFormValues {
  name: string;
  role: string;
  email: string;
  status: string;
}

const Team: React.FC = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const addForm = useForm<TeamMemberFormValues>({
    defaultValues: {
      name: "",
      role: "",
      email: "",
      status: "active"
    }
  });

  const editForm = useForm<TeamMemberFormValues>({
    defaultValues: {
      name: "",
      role: "",
      email: "",
      status: "active"
    }
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = () => {
    setLoading(true);
    const mockTeamMembers = [
      {
        id: "1",
        name: "Alex Johnson",
        role: "Product Manager",
        email: "alex@example.com",
        avatarUrl: "",
        status: "active",
        tasksCompleted: 24,
      },
      {
        id: "2",
        name: "Sarah Williams",
        role: "UX Designer",
        email: "sarah@example.com",
        avatarUrl: "",
        status: "active",
        tasksCompleted: 18,
      },
      {
        id: "3",
        name: "Michael Chen",
        role: "Frontend Developer",
        email: "michael@example.com",
        avatarUrl: "",
        status: "active",
        tasksCompleted: 32,
      },
      {
        id: "4",
        name: "Emily Davis",
        role: "Backend Developer",
        email: "emily@example.com",
        avatarUrl: "",
        status: "inactive",
        tasksCompleted: 15,
      },
    ];
    setTeamMembers(mockTeamMembers);
    setLoading(false);
  };

  const handleAddMember = (data: TeamMemberFormValues) => {
    const newMember: TeamMember = {
      id: `${Date.now()}`,
      name: data.name,
      role: data.role,
      email: data.email,
      avatarUrl: "",
      status: data.status,
      tasksCompleted: 0,
    };

    setTeamMembers([...teamMembers, newMember]);
    addForm.reset();
    setIsAddDialogOpen(false);
    toast({
      title: "Team member added",
      description: `${data.name} has been added to the team.`,
    });
  };

  const handleEditMember = (data: TeamMemberFormValues) => {
    if (!selectedMember) return;
    
    const updatedMembers = teamMembers.map((member) => 
      member.id === selectedMember.id ? 
        { ...member, name: data.name, role: data.role, email: data.email, status: data.status } : 
        member
    );
    
    setTeamMembers(updatedMembers);
    editForm.reset();
    setIsEditDialogOpen(false);
    toast({
      title: "Team member updated",
      description: `${data.name}'s information has been updated.`,
    });
  };

  const handleDeleteMember = () => {
    if (!selectedMember) return;
    
    const updatedMembers = teamMembers.filter((member) => member.id !== selectedMember.id);
    setTeamMembers(updatedMembers);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Team member removed",
      description: `${selectedMember.name} has been removed from the team.`,
      variant: "destructive",
    });
  };

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    editForm.reset({
      name: member.name,
      role: member.role,
      email: member.email,
      status: member.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
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
        title="Team"
        description="Manage your team members and their access"
        icon={<Icons.users className="h-6 w-6" />}
        action={{
          label: "Add Team Member",
          onClick: () => setIsAddDialogOpen(true),
          icon: <Icons.userPlus className="mr-2 h-4 w-4" />,
        }}
      />
      
      <div className="mt-6 space-y-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{member.name}</h3>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                  <p className="text-sm">{member.email}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm">Tasks Completed</p>
                  <p className="text-xl font-semibold">{member.tasksCompleted}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(member)}
                  >
                    <Icons.edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(member)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <FormField
                control={addForm.control}
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
                      </SelectContent>
                    </Select>
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
                      </SelectContent>
                    </Select>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to remove {selectedMember?.name} from the team? This action cannot be undone.</p>
          </div>
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

export default Team;
