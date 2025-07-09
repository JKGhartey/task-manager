import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  taskService,
  type Task,
  type UpdateTaskData,
} from "@/utils/taskService";
import { getAllProjects, type Project } from "@/utils/projectService";
import { useAuth } from "@/hooks/useAuth";
import api from "@/utils/axiosInstance";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  position?: string;
}

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<UpdateTaskData>({});
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchTask();
      fetchUsers();
      fetchProjects();
    }
  }, [id, isAuthenticated]);

  const fetchTask = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const taskData = await taskService.getTaskById(id);
      setTask(taskData);
      setFormData({
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        priority: taskData.priority,
        assignee: taskData.assignee._id,
        project: taskData.project || "",
        department: taskData.department || "",
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString().split("T")[0]
          : "",
        estimatedHours: taskData.estimatedHours,
        tags: taskData.tags,
        isPublic: taskData.isPublic,
      });
    } catch (error) {
      console.error("Failed to fetch task:", error);
      toast.error("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    }
  };

  const fetchProjects = async () => {
    try {
      const projectsData = await getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to load projects");
    }
  };

  const handleInputChange = (
    field: keyof UpdateTaskData,
    value: string | number | boolean | string[] | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !task ||
      !formData.title?.trim() ||
      !formData.description?.trim() ||
      !formData.assignee
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      await taskService.updateTask(task._id, formData);
      toast.success("Task updated successfully");
      navigate(`/tasks/${task._id}`);
    } catch (error: unknown) {
      console.error("Failed to update task:", error);
      const message =
        error instanceof Error ? error.message : "Failed to update task";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to edit tasks</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter task description"
                  rows={4}
                  required
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || "feature"}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority || "medium"}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignee">Assignee *</Label>
                <Select
                  value={formData.assignee || undefined}
                  onValueChange={(value) =>
                    handleInputChange("assignee", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="project">Project</Label>
                <Select
                  value={formData.project || ""}
                  onValueChange={(value) => handleInputChange("project", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department || ""}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  placeholder="Enter department"
                />
              </div>

              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  max="1000"
                  value={formData.estimatedHours || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "estimatedHours",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="Enter estimated hours"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Public Task */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic || false}
                onCheckedChange={(checked) =>
                  handleInputChange("isPublic", checked)
                }
              />
              <Label htmlFor="isPublic">Make this task public</Label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/tasks/${task._id}`)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTask;
