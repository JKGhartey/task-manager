"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  IconPlus,
  IconSearch,
  IconFolder,
  IconEdit,
  IconTrash,
  IconLink,
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
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  assignTaskToProject,
  removeTaskFromProject,
  type Project,
  type CreateProjectRequest,
  type UpdateProjectRequest,
} from "@/utils/projectService";
import { getAllTeams, type Team } from "@/utils/teamService";
import { taskService, type Task } from "@/utils/taskService";

export default function ManageProjects() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form states
  const [createFormData, setCreateFormData] = useState<CreateProjectRequest>({
    name: "",
    description: "",
    team: "none",
    tasks: [],
  });

  const [editFormData, setEditFormData] = useState<UpdateProjectRequest>({
    name: "",
    description: "",
    team: "",
    tasks: [],
  });

  const [selectedTask, setSelectedTask] = useState<string>("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const teamsData = await getAllTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAllTasks({ page: 1, limit: 100 });
      setTasks(response.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchTeams();
      fetchTasks();
    }
  }, [isAuthenticated]);

  const handleCreate = () => {
    setCreateFormData({
      name: "",
      description: "",
      team: "none",
      tasks: [],
    });
    setShowCreateModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setEditFormData({
      name: project.name,
      description: project.description || "",
      team: project.team?._id || "none",
      tasks: project.tasks.map((task) => task._id),
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const submitData = {
        ...createFormData,
        team: createFormData.team === "none" ? "" : createFormData.team,
      };
      await createProject(submitData);
      toast.success("Project created successfully");
      setShowCreateModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const handleEditSubmit = async () => {
    if (!editingProject) return;
    try {
      const submitData = {
        ...editFormData,
        team: editFormData.team === "none" ? "" : editFormData.team,
      };
      await updateProject(editingProject._id, submitData);
      toast.success("Project updated successfully");
      setShowEditModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleAssignTask = async () => {
    if (!selectedProject || !selectedTask) return;
    try {
      await assignTaskToProject(selectedProject._id, selectedTask);
      toast.success("Task assigned to project successfully");
      setShowAssignTaskModal(false);
      setSelectedTask("");
      fetchProjects();
    } catch (error) {
      console.error("Error assigning task to project:", error);
      toast.error("Failed to assign task to project");
    }
  };

  const handleRemoveTask = async (projectId: string, taskId: string) => {
    if (
      !confirm("Are you sure you want to remove this task from the project?")
    ) {
      return;
    }
    try {
      await removeTaskFromProject(projectId, taskId);
      toast.success("Task removed from project successfully");
      fetchProjects();
    } catch (error) {
      console.error("Error removing task from project:", error);
      toast.error("Failed to remove task from project");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Please log in to manage projects
          </p>
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
            <IconFolder className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Manage Projects</h1>
              <p className="text-muted-foreground text-sm">
                Create and manage projects, assign tasks to projects
              </p>
            </div>
          </div>
          <Button onClick={handleCreate}>
            <IconPlus className="w-4 h-4 mr-2" /> Create Project
          </Button>
        </div>

        {/* Search */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Search Projects</CardTitle>
            <CardDescription>
              Find projects by name or description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Projects</CardTitle>
            <CardDescription>
              {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""} found
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
            ) : filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <IconFolder className="w-12 h-12 mb-2 text-muted-foreground" />
                <p className="text-lg font-semibold">No projects found</p>
                <p className="text-sm">
                  Try adjusting your search or create a new project.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project._id}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {project.description || "No description"}
                      </TableCell>
                      <TableCell>
                        {project.team ? (
                          <Badge variant="secondary">{project.team.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">No team</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.tasks.map((task) => (
                            <Badge
                              key={task._id}
                              variant="outline"
                              className="text-xs flex items-center gap-1"
                            >
                              {task.title}
                              <button
                                onClick={() =>
                                  handleRemoveTask(project._id, task._id)
                                }
                                className="ml-1 hover:text-red-500"
                                title="Remove task"
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
                              setSelectedProject(project);
                              setShowAssignTaskModal(true);
                            }}
                          >
                            <IconLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(project)}
                          >
                            <IconEdit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(project._id)}
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

        {/* Create Project Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new project and optionally assign a team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={createFormData.name}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter project name"
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
                  placeholder="Enter project description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Team (Optional)</Label>
                <Select
                  value={createFormData.team}
                  onValueChange={(value) =>
                    setCreateFormData({ ...createFormData, team: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No team</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSubmit}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Project Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update project information and team assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Project Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  placeholder="Enter project name"
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
                  placeholder="Enter project description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-team">Team</Label>
                <Select
                  value={editFormData.team}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, team: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No team</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Update Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Task Modal */}
        <Dialog
          open={showAssignTaskModal}
          onOpenChange={setShowAssignTaskModal}
        >
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Task to Project</DialogTitle>
              <DialogDescription>
                Select a task to assign to {selectedProject?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task">Select Task</Label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks
                      .filter(
                        (task) =>
                          !selectedProject?.tasks.some(
                            (projectTask) => projectTask._id === task._id
                          )
                      )
                      .map((task) => (
                        <SelectItem key={task._id} value={task._id}>
                          {task.title} ({task.status})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAssignTaskModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignTask} disabled={!selectedTask}>
                Assign Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
