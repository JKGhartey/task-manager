"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  IconPlus,
  IconSearch,
  IconUsers,
  IconEdit,
  IconTrash,
  IconUserPlus,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignUserToTeam,
  removeUserFromTeam,
  type Team,
  type CreateTeamRequest,
  type UpdateTeamRequest,
} from "@/utils/teamService";
import { userService, type User } from "@/utils/userService";

export default function ManageTeams() {
  const { isAuthenticated } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Form states
  const [createFormData, setCreateFormData] = useState<CreateTeamRequest>({
    name: "",
    description: "",
    members: [],
  });

  const [editFormData, setEditFormData] = useState<UpdateTeamRequest>({
    name: "",
    description: "",
    members: [],
  });

  const [selectedUser, setSelectedUser] = useState<string>("");

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await getAllTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers({
        page: 1,
        limit: 100,
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeams();
      fetchUsers();
    }
  }, [isAuthenticated]);

  const handleCreate = () => {
    setCreateFormData({
      name: "",
      description: "",
      members: [],
    });
    setShowCreateModal(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setEditFormData({
      name: team.name,
      description: team.description || "",
      members: team.members.map((member) => member._id),
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) {
      return;
    }
    try {
      await deleteTeam(id);
      toast.success("Team deleted successfully");
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    }
  };

  const handleCreateSubmit = async () => {
    try {
      await createTeam(createFormData);
      toast.success("Team created successfully");
      setShowCreateModal(false);
      fetchTeams();
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    }
  };

  const handleEditSubmit = async () => {
    if (!editingTeam) return;
    try {
      await updateTeam(editingTeam._id, editFormData);
      toast.success("Team updated successfully");
      setShowEditModal(false);
      fetchTeams();
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to update team");
    }
  };

  const handleAssignUser = async () => {
    if (!selectedTeam || !selectedUser) return;
    try {
      await assignUserToTeam(selectedTeam._id, selectedUser);
      toast.success("User assigned to team successfully");
      setShowAssignModal(false);
      setSelectedUser("");
      fetchTeams();
    } catch (error) {
      console.error("Error assigning user to team:", error);
      toast.error("Failed to assign user to team");
    }
  };

  const handleRemoveUser = async (teamId: string, userId: string) => {
    if (!confirm("Are you sure you want to remove this user from the team?")) {
      return;
    }
    try {
      await removeUserFromTeam(teamId, userId);
      toast.success("User removed from team successfully");
      fetchTeams();
    } catch (error) {
      console.error("Error removing user from team:", error);
      toast.error("Failed to remove user from team");
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) ||
      team.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please log in to manage teams</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b">
          <div className="flex items-center gap-3">
            <IconUsers className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Manage Teams</h1>
              <p className="text-muted-foreground text-sm">
                Create and manage teams, assign users to teams
              </p>
            </div>
          </div>
          <Button onClick={handleCreate}>
            <IconPlus className="w-4 h-4 mr-2" /> Create Team
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Search Teams</CardTitle>
            <CardDescription>Find teams by name or description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search teams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Teams Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Teams</CardTitle>
            <CardDescription>
              {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""}{" "}
              found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-muted rounded w-full" />
                  ))}
                </div>
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <IconUsers className="w-12 h-12 mb-2 text-muted-foreground" />
                <p className="text-lg font-semibold">No teams found</p>
                <p className="text-sm">
                  Try adjusting your search or create a new team.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team) => (
                    <TableRow key={team._id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {team.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {team.members.map((member) => (
                            <Badge
                              key={member._id}
                              variant="secondary"
                              className="text-xs flex items-center gap-1"
                            >
                              {member.firstName} {member.lastName}
                              <button
                                onClick={() =>
                                  handleRemoveUser(team._id, member._id)
                                }
                                className="ml-1 hover:text-red-500"
                                title="Remove user"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTeam(team);
                              setShowAssignModal(true);
                            }}
                          >
                            <IconUserPlus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(team)}
                          >
                            <IconEdit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(team._id)}
                          >
                            <IconTrash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Team Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new team and optionally assign members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  value={createFormData.name}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter team name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter team description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSubmit}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Team Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Team</DialogTitle>
              <DialogDescription>
                Update team information and members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Team Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  placeholder="Enter team name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter team description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Update Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign User Modal */}
        <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign User to Team</DialogTitle>
              <DialogDescription>
                Select a user to assign to {selectedTeam?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user">Select User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(
                        (user) =>
                          !selectedTeam?.members.some(
                            (member) => member._id === user._id
                          )
                      )
                      .map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignUser} disabled={!selectedUser}>
                Assign User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
