import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  taskService,
  type Task,
  type TaskFilters,
  type CreateTaskData,
  type UpdateTaskData,
} from "@/utils/taskService";
import { useAuth } from "@/hooks/useAuth";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import {
  IconSearch,
  IconPlus,
  IconUsers,
  IconEdit,
  IconTrash,
  IconEye,
  IconTag,
  IconSettings,
} from "@tabler/icons-react";
import { getAllProjects, type Project } from "@/utils/projectService";
import api from "@/utils/axiosInstance";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  position?: string;
}

interface Department {
  _id: string;
  name: string;
  description?: string;
  status: string;
}

const ManageTasks = () => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  // Calendar states
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [showEditCalendar, setShowEditCalendar] = useState(false);

  // Form states
  const [createFormData, setCreateFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    type: "feature",
    priority: "medium",
    assignee: "",
    project: "none",
    department: "none",
    dueDate: "",
    estimatedHours: undefined,
    tags: [],
    isPublic: false,
  });

  const [editFormData, setEditFormData] = useState<UpdateTaskData>({});
  const [tagInput, setTagInput] = useState("");

  const fetchTasks = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await taskService.getAllTasks(filters);
      setTasks(response.tasks);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
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

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments/public/active");
      setDepartments(response.data.data.departments);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to load departments");
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchUsers();
      fetchDepartments();
      fetchProjects();
    }
  }, [isAuthenticated, filters]);

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".calendar-container") && !target.closest("button")) {
        setShowCreateCalendar(false);
        setShowEditCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      await taskService.deleteTask(taskId);
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleFilterChange = (
    key: keyof TaskFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  // Modal handlers
  const handleCreate = () => {
    setCreateFormData({
      title: "",
      description: "",
      type: "feature",
      priority: "medium",
      assignee: "",
      project: "none",
      department: "none",
      dueDate: "",
      estimatedHours: undefined,
      tags: [],
      isPublic: false,
    });
    setTagInput("");
    setShowCreateModal(true);
  };

  const handleEdit = async (taskId: string) => {
    try {
      const taskData = await taskService.getTaskById(taskId);
      setEditingTask(taskData);
      setEditFormData({
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        priority: taskData.priority,
        status: taskData.status,
        assignee: taskData.assignee._id,
        project: taskData.project || "none",
        department: taskData.department || "none",
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString().split("T")[0]
          : "",
        estimatedHours: taskData.estimatedHours,
        tags: taskData.tags,
        isPublic: taskData.isPublic,
      });
      setTagInput("");
      setShowEditModal(true);
    } catch (error) {
      console.error("Failed to fetch task:", error);
      toast.error("Failed to load task");
    }
  };

  const handleView = async (taskId: string) => {
    try {
      const taskData = await taskService.getTaskById(taskId);
      setViewingTask(taskData);
      setShowViewModal(true);
    } catch (error) {
      console.error("Failed to fetch task:", error);
      toast.error("Failed to load task details");
    }
  };

  const handleCreateSubmit = async () => {
    if (
      !createFormData.title.trim() ||
      !createFormData.description.trim() ||
      !createFormData.assignee
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const submitData = {
        ...createFormData,
        project:
          createFormData.project === "none" ? "" : createFormData.project,
        department:
          createFormData.department === "none" ? "" : createFormData.department,
      };
      await taskService.createTask(submitData);
      toast.success("Task created successfully");
      setShowCreateModal(false);
      fetchTasks();
    } catch (error: unknown) {
      console.error("Failed to create task:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create task";
      toast.error(message);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingTask) return;

    if (
      !editFormData.title?.trim() ||
      !editFormData.description?.trim() ||
      !editFormData.assignee
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const submitData = {
        ...editFormData,
        project: editFormData.project === "none" ? "" : editFormData.project,
        department:
          editFormData.department === "none" ? "" : editFormData.department,
      };
      await taskService.updateTask(editingTask._id, submitData);
      toast.success("Task updated successfully");
      setShowEditModal(false);
      fetchTasks();
    } catch (error: unknown) {
      console.error("Failed to update task:", error);
      const message =
        error instanceof Error ? error.message : "Failed to update task";
      toast.error(message);
    }
  };

  const handleAddTag = (formType: "create" | "edit") => {
    if (tagInput.trim()) {
      if (formType === "create") {
        if (!createFormData.tags?.includes(tagInput.trim())) {
          setCreateFormData((prev) => ({
            ...prev,
            tags: [...(prev.tags || []), tagInput.trim()],
          }));
        }
      } else {
        if (!editFormData.tags?.includes(tagInput.trim())) {
          setEditFormData((prev) => ({
            ...prev,
            tags: [...(prev.tags || []), tagInput.trim()],
          }));
        }
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (
    tagToRemove: string,
    formType: "create" | "edit"
  ) => {
    if (formType === "create") {
      setCreateFormData((prev) => ({
        ...prev,
        tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
      }));
    }
  };

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".calendar-container") && !target.closest("button")) {
        setShowCreateCalendar(false);
        setShowEditCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please log in to manage tasks</p>
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
              <h1 className="text-3xl font-bold">Manage Tasks</h1>
              <p className="text-muted-foreground text-sm">
                View and manage all tasks in the system
              </p>
            </div>
          </div>
          <Button onClick={handleCreate}>
            <IconPlus className="w-4 h-4 mr-2" /> Create New Task
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>
              Refine your search and filter tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Search</label>
                <div className="relative">
                  <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={filters.search || ""}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("status", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <Select
                  value={filters.priority || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("priority", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Items per page
                </label>
                <Select
                  value={filters.limit?.toString() || "10"}
                  onValueChange={(value) =>
                    handleFilterChange("limit", parseInt(value))
                  }
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={clearFilters} className="h-10">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasks</CardTitle>
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
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <IconUsers className="w-12 h-12 mb-2 text-muted-foreground" />
                <p className="text-lg font-semibold">No tasks found</p>
                <p className="text-sm">
                  Try adjusting your filters or create a new task.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            task.type === "bug"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : task.type === "feature"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : task.type === "improvement"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : task.type === "documentation"
                              ? "bg-purple-100 text-purple-800 border-purple-200"
                              : task.type === "maintenance"
                              ? "bg-orange-100 text-orange-800 border-orange-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }
                        >
                          {task.type.charAt(0).toUpperCase() +
                            task.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.status === "done"
                              ? "default"
                              : task.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            task.status === "done"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : task.status === "review"
                              ? "bg-orange-100 text-orange-800"
                              : task.status === "testing"
                              ? "bg-purple-100 text-purple-800"
                              : task.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {task.status === "in_progress"
                            ? "Pending"
                            : task.status.charAt(0).toUpperCase() +
                              task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            task.priority === "urgent"
                              ? "destructive"
                              : task.priority === "high"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            task.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.assignee.firstName} {task.assignee.lastName}
                      </TableCell>
                      <TableCell>
                        {task.createdBy.firstName} {task.createdBy.lastName}
                      </TableCell>
                      <TableCell>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(task._id)}
                          >
                            <IconEye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(task._id)}
                          >
                            <IconEdit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTask(task._id)}
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Create Task Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-3xl font-bold">
                Create New Task
              </DialogTitle>
              <DialogDescription className="text-lg">
                Fill in the details below to create a new task.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-10">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2">
                  <IconUsers className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">
                      Task Title *
                    </Label>
                    <Input
                      id="title"
                      value={createFormData.title}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter task title"
                      className="mt-2 h-12 text-base"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-base font-medium"
                    >
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={createFormData.description}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter task description"
                      rows={5}
                      className="mt-2 text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="type" className="text-base font-medium">
                        Type
                      </Label>
                      <Select
                        value={createFormData.type}
                        onValueChange={(value) =>
                          setCreateFormData({
                            ...createFormData,
                            type: value as
                              | "feature"
                              | "bug"
                              | "improvement"
                              | "documentation"
                              | "maintenance",
                          })
                        }
                      >
                        <SelectTrigger className="mt-2 h-12 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="improvement">
                            Improvement
                          </SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="priority"
                        className="text-base font-medium"
                      >
                        Priority
                      </Label>
                      <Select
                        value={createFormData.priority}
                        onValueChange={(value) =>
                          setCreateFormData({
                            ...createFormData,
                            priority: value as
                              | "low"
                              | "medium"
                              | "high"
                              | "urgent",
                          })
                        }
                      >
                        <SelectTrigger className="mt-2 h-12 text-base">
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
                  </div>
                </div>
              </div>

              {/* Assignment & Organization Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2">
                  <IconSettings className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">
                    Assignment & Organization
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="w-full">
                    <Label htmlFor="assignee" className="text-base font-medium">
                      Assignee *
                    </Label>
                    <Select
                      value={createFormData.assignee}
                      onValueChange={(value) =>
                        setCreateFormData({
                          ...createFormData,
                          assignee: value,
                        })
                      }
                    >
                      <SelectTrigger className="mt-2 h-12 text-base w-full">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label htmlFor="project" className="text-base font-medium">
                      Project
                    </Label>
                    <Select
                      value={createFormData.project}
                      onValueChange={(value) =>
                        setCreateFormData({ ...createFormData, project: value })
                      }
                    >
                      <SelectTrigger className="mt-2 h-12 text-base w-full">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No project</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label
                      htmlFor="department"
                      className="text-base font-medium"
                    >
                      Department
                    </Label>
                    <Select
                      value={createFormData.department}
                      onValueChange={(value) =>
                        setCreateFormData({
                          ...createFormData,
                          department: value,
                        })
                      }
                    >
                      <SelectTrigger className="mt-2 h-12 text-base w-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No department</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept._id} value={dept._id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label htmlFor="dueDate" className="text-base font-medium">
                      Due Date
                    </Label>
                    <div className="relative">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setShowCreateCalendar(!showCreateCalendar)
                        }
                        className="mt-2 h-12 text-base w-full justify-start text-left font-normal"
                      >
                        {createFormData.dueDate ? (
                          new Date(createFormData.dueDate).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                      </Button>
                      {showCreateCalendar && (
                        <div className="calendar-container absolute top-full left-0 z-50 mt-1 bg-background border rounded-md shadow-lg">
                          <Calendar
                            mode="single"
                            selected={
                              createFormData.dueDate
                                ? new Date(createFormData.dueDate)
                                : undefined
                            }
                            onSelect={(date) => {
                              setCreateFormData({
                                ...createFormData,
                                dueDate: date
                                  ? date.toISOString().split("T")[0]
                                  : "",
                              });
                              setShowCreateCalendar(false);
                            }}
                            initialFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <Label
                      htmlFor="estimatedHours"
                      className="text-base font-medium"
                    >
                      Estimated Hours
                    </Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={createFormData.estimatedHours || ""}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          estimatedHours: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="Enter estimated hours"
                      className="mt-2 h-12 text-base w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2">
                  <IconTag className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Additional Details</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="tags" className="text-base font-medium">
                      Tags
                    </Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        className="h-12 text-base"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag("create");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddTag("create")}
                        className="h-12 px-6"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {createFormData.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1 text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag, "create")}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isPublic"
                      checked={createFormData.isPublic}
                      onCheckedChange={(checked) =>
                        setCreateFormData({
                          ...createFormData,
                          isPublic: !!checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                    <Label htmlFor="isPublic" className="text-base">
                      Make this task public
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-8 border-t-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="h-12 px-8"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSubmit} className="h-12 px-8">
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Task Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-3xl font-bold">
                Edit Task
              </DialogTitle>
              <DialogDescription className="text-lg">
                Update task information and details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-10">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2">
                  <IconUsers className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="edit-title"
                      className="text-base font-medium"
                    >
                      Task Title *
                    </Label>
                    <Input
                      id="edit-title"
                      value={editFormData.title || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter task title"
                      className="mt-2 h-12 text-base"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="edit-description"
                      className="text-base font-medium"
                    >
                      Description *
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={editFormData.description || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter task description"
                      rows={5}
                      className="mt-2 text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="w-full">
                      <Label
                        htmlFor="edit-type"
                        className="text-base font-medium"
                      >
                        Type
                      </Label>
                      <Select
                        value={editFormData.type || "feature"}
                        onValueChange={(value) =>
                          setEditFormData({
                            ...editFormData,
                            type: value as
                              | "feature"
                              | "bug"
                              | "improvement"
                              | "documentation"
                              | "maintenance",
                          })
                        }
                      >
                        <SelectTrigger className="mt-2 h-12 text-base w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="improvement">
                            Improvement
                          </SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full">
                      <Label
                        htmlFor="edit-priority"
                        className="text-base font-medium"
                      >
                        Priority
                      </Label>
                      <Select
                        value={editFormData.priority || "medium"}
                        onValueChange={(value) =>
                          setEditFormData({
                            ...editFormData,
                            priority: value as
                              | "low"
                              | "medium"
                              | "high"
                              | "urgent",
                          })
                        }
                      >
                        <SelectTrigger className="mt-2 h-12 text-base w-full">
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

                    <div className="w-full">
                      <Label
                        htmlFor="edit-status"
                        className="text-base font-medium"
                      >
                        Status
                      </Label>
                      <Select
                        value={editFormData.status || "pending"}
                        onValueChange={(value) =>
                          setEditFormData({
                            ...editFormData,
                            status: value as
                              | "pending"
                              | "in_progress"
                              | "review"
                              | "testing"
                              | "done"
                              | "cancelled",
                          })
                        }
                      >
                        <SelectTrigger className="mt-2 h-12 text-base w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment & Organization Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2">
                  <IconSettings className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">
                    Assignment & Organization
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="w-full">
                    <Label
                      htmlFor="edit-assignee"
                      className="text-base font-medium"
                    >
                      Assignee *
                    </Label>
                    <Select
                      value={editFormData.assignee || ""}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, assignee: value })
                      }
                    >
                      <SelectTrigger className="mt-2 h-12 text-base w-full">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label
                      htmlFor="edit-project"
                      className="text-base font-medium"
                    >
                      Project
                    </Label>
                    <Select
                      value={editFormData.project || "none"}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, project: value })
                      }
                    >
                      <SelectTrigger className="mt-2 h-12 text-base w-full">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No project</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label
                      htmlFor="edit-department"
                      className="text-base font-medium"
                    >
                      Department
                    </Label>
                    <Select
                      value={editFormData.department || "none"}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, department: value })
                      }
                    >
                      <SelectTrigger className="mt-2 h-12 text-base w-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No department</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept._id} value={dept._id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label
                      htmlFor="edit-dueDate"
                      className="text-base font-medium"
                    >
                      Due Date
                    </Label>
                    <div className="relative">
                      <Button
                        variant="outline"
                        onClick={() => setShowEditCalendar(!showEditCalendar)}
                        className="mt-2 h-12 text-base w-full justify-start text-left font-normal"
                      >
                        {editFormData.dueDate ? (
                          new Date(editFormData.dueDate).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                      </Button>
                      {showEditCalendar && (
                        <div className="calendar-container absolute top-full left-0 z-50 mt-1 bg-background border rounded-md shadow-lg">
                          <Calendar
                            mode="single"
                            selected={
                              editFormData.dueDate
                                ? new Date(editFormData.dueDate)
                                : undefined
                            }
                            onSelect={(date) => {
                              setEditFormData({
                                ...editFormData,
                                dueDate: date
                                  ? date.toISOString().split("T")[0]
                                  : "",
                              });
                              setShowEditCalendar(false);
                            }}
                            initialFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <Label
                      htmlFor="edit-estimatedHours"
                      className="text-base font-medium"
                    >
                      Estimated Hours
                    </Label>
                    <Input
                      id="edit-estimatedHours"
                      type="number"
                      value={editFormData.estimatedHours || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          estimatedHours: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="Enter estimated hours"
                      className="mt-2 h-12 text-base w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2">
                  <IconTag className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Additional Details</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="edit-tags"
                      className="text-base font-medium"
                    >
                      Tags
                    </Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="edit-tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        className="h-12 text-base"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag("edit");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddTag("edit")}
                        className="h-12 px-6"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {editFormData.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1 text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag, "edit")}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="edit-isPublic"
                      checked={editFormData.isPublic || false}
                      onCheckedChange={(checked) =>
                        setEditFormData({
                          ...editFormData,
                          isPublic: !!checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                    <Label htmlFor="edit-isPublic" className="text-base">
                      Make this task public
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-8 border-t-2">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="h-12 px-8"
              >
                Cancel
              </Button>
              <Button onClick={handleEditSubmit} className="h-12 px-8">
                Update Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Task Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-3xl font-bold">
                Task Details
              </DialogTitle>
              <DialogDescription className="text-lg">
                View complete task information.
              </DialogDescription>
            </DialogHeader>

            {viewingTask && (
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2">
                    <IconUsers className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold">Basic Information</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Task Title
                      </Label>
                      <p className="mt-2 text-lg font-semibold">
                        {viewingTask.title}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Description
                      </Label>
                      <p className="mt-2 text-base whitespace-pre-wrap">
                        {viewingTask.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <Label className="text-base font-medium text-muted-foreground">
                          Type
                        </Label>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${
                            viewingTask.type === "bug"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : viewingTask.type === "feature"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : viewingTask.type === "improvement"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : viewingTask.type === "documentation"
                              ? "bg-purple-100 text-purple-800 border-purple-200"
                              : viewingTask.type === "maintenance"
                              ? "bg-orange-100 text-orange-800 border-orange-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {viewingTask.type.charAt(0).toUpperCase() +
                            viewingTask.type.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-base font-medium text-muted-foreground">
                          Priority
                        </Label>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${
                            viewingTask.priority === "urgent"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : viewingTask.priority === "high"
                              ? "bg-orange-100 text-orange-800 border-orange-200"
                              : viewingTask.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-green-100 text-green-800 border-green-200"
                          }`}
                        >
                          {viewingTask.priority.charAt(0).toUpperCase() +
                            viewingTask.priority.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-base font-medium text-muted-foreground">
                          Status
                        </Label>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${
                            viewingTask.status === "done"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : viewingTask.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : viewingTask.status === "review"
                              ? "bg-orange-100 text-orange-800 border-orange-200"
                              : viewingTask.status === "testing"
                              ? "bg-purple-100 text-purple-800 border-purple-200"
                              : viewingTask.status === "cancelled"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {viewingTask.status === "in_progress"
                            ? "Pending"
                            : viewingTask.status.charAt(0).toUpperCase() +
                              viewingTask.status.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-base font-medium text-muted-foreground">
                          Progress
                        </Label>
                        <div className="mt-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${viewingTask.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground mt-1">
                            {viewingTask.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment & Organization Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2">
                    <IconSettings className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold">
                      Assignment & Organization
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Assignee
                      </Label>
                      <p className="mt-2 text-base">
                        {viewingTask.assignee.firstName}{" "}
                        {viewingTask.assignee.lastName}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Created By
                      </Label>
                      <p className="mt-2 text-base">
                        {viewingTask.createdBy.firstName}{" "}
                        {viewingTask.createdBy.lastName}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Project
                      </Label>
                      <p className="mt-2 text-base">
                        {viewingTask.project || "No project assigned"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Department
                      </Label>
                      <p className="mt-2 text-base">
                        {viewingTask.department || "No department assigned"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Due Date
                      </Label>
                      <p className="mt-2 text-base">
                        {viewingTask.dueDate
                          ? new Date(viewingTask.dueDate).toLocaleDateString()
                          : "No due date"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Estimated Hours
                      </Label>
                      <p className="mt-2 text-base">
                        {viewingTask.estimatedHours
                          ? `${viewingTask.estimatedHours} hours`
                          : "Not specified"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Actual Hours
                      </Label>
                      <p className="mt-2 text-base">
                        {viewingTask.actualHours
                          ? `${viewingTask.actualHours} hours`
                          : "Not tracked"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Created Date
                      </Label>
                      <p className="mt-2 text-base">
                        {new Date(viewingTask.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Last Updated
                      </Label>
                      <p className="mt-2 text-base">
                        {new Date(viewingTask.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2">
                    <IconTag className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold">
                      Additional Details
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Tags
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {viewingTask.tags && viewingTask.tags.length > 0 ? (
                          viewingTask.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="px-3 py-1 text-sm"
                            >
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">
                            No tags assigned
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-muted-foreground">
                        Visibility
                      </Label>
                      <p className="mt-2 text-base">
                        {viewingTask.isPublic ? "Public" : "Private"}
                      </p>
                    </div>

                    {viewingTask.subtasks &&
                      viewingTask.subtasks.length > 0 && (
                        <div>
                          <Label className="text-base font-medium text-muted-foreground">
                            Subtasks
                          </Label>
                          <div className="mt-2 space-y-2">
                            {viewingTask.subtasks.map((subtask, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 bg-muted rounded"
                              >
                                <Checkbox
                                  checked={subtask.completed}
                                  disabled
                                />
                                <span
                                  className={
                                    subtask.completed
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }
                                >
                                  {subtask.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {viewingTask.comments &&
                      viewingTask.comments.length > 0 && (
                        <div>
                          <Label className="text-base font-medium text-muted-foreground">
                            Comments
                          </Label>
                          <div className="mt-2 space-y-3">
                            {viewingTask.comments.map((comment, index) => (
                              <div key={index} className="p-3 bg-muted rounded">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">
                                    {comment.user.firstName}{" "}
                                    {comment.user.lastName}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(
                                      comment.timestamp
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-8 border-t-2">
              <Button
                variant="outline"
                onClick={() => setShowViewModal(false)}
                className="h-12 px-8"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageTasks;
